"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const VorteEmbed_1 = require("./VorteEmbed");
const VorteGuild_1 = require("./VorteGuild");
const events_1 = require("events");
const cooldowns = new Set();
class Handler {
    constructor(bot) {
        this.bot = bot;
        this.loadEvents = () => {
            console.log("----------------------------------------------");
            for (const file of Handler.walk(path_1.join(__dirname, "..", "events"))) {
                const evtClass = (_ => _.default || _.Evt || _)(require(file));
                const evt = new evtClass();
                evt._onLoad(this);
                const emitters = { client: this.bot, process, andesite: this.bot.andesite };
                ((typeof evt.emitter === "function" && evt.emitter instanceof events_1.EventEmitter)
                    ? evt.emitter
                    : emitters[evt.emitter])[evt.type](evt.event, evt.run.bind(evt));
                console.log(`\u001b[32m[EVT ✅ ]\u001b[0m => Successfully loaded \u001b[34m${evt.category}\u001b[0m:${evt.name}`);
            }
            console.log("\u001b[32m[EVT ✅ ]\u001b[0m => Loaded all Events!");
        };
        this.loadCommands = () => {
            console.log("----------------------------------------------");
            for (const file of Handler.walk(path_1.join(__dirname, "..", "commands"))) {
                try {
                    const cmdClass = (_ => _.default || _.Cmd || _)(require(file));
                    const cmd = new cmdClass(this.bot);
                    cmd._onLoad(this);
                    this.bot.commands.set(cmd.name, cmd);
                    cmd.aliases.forEach((alias) => this.bot.aliases.set(alias, cmd.name));
                    console.log(`\u001b[32m[CMD ✅ ]\u001b[0m => Successfully loaded \u001b[34m${cmd.category}\u001b[0m:${cmd.name}`);
                }
                catch (e) {
                    console.log(`\u001b[31m[CMD ❌ ]\u001b[0m => ${file} has an error: ${e.toString()}`);
                }
            }
            console.log("\u001b[32m[CMD ✅ ]\u001b[0m => Loaded all commands!");
        };
        this.loadEvents = this.loadEvents.bind(this);
        this.loadCommands = this.loadCommands.bind(this);
    }
    runCommand(message, member) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot || !message.guild)
                return;
            if (!message.member)
                Object.defineProperty(message, "member", yield message.guild.members.fetch(message.author));
            const guild = new VorteGuild_1.VorteGuild(message.guild);
            const args = message.content.slice(guild.prefix.length).trim().split(/ +/g);
            const cmd = args.shift();
            const command = this.bot.commands.get(cmd) || this.bot.commands.get(this.bot.aliases.get(cmd)) || null;
            if (!message.content.startsWith(guild.prefix))
                return;
            if (command) {
                if (cooldowns.has(message.author.id))
                    return message.reply("Sorry you still have a cooldown! Please wait");
                cooldowns.add(message.author.id);
                try {
                    yield command.run(message, args, guild, member);
                }
                catch (e) {
                    console.log(e);
                    message.channel.send(new VorteEmbed_1.VorteEmbed(message)
                        .errorEmbed(process.argv.includes("debug") ? e : undefined)
                        .setDescription("Sorry, I ran into an error."));
                }
                ;
                setTimeout(() => {
                    cooldowns.delete(message.author.id);
                }, command.cooldown);
            }
            ;
        });
    }
    getCommand(name) {
        return this.bot.commands.get(name) || this.bot.commands.get(this.bot.aliases.get(name)) || undefined;
    }
    getCat(name) {
        return this.bot.commands.filter((command) => command.category === name);
    }
    getAllCommands() {
        return {
            commands: this.bot.commands.map((x) => x),
            size: this.bot.commands.size
        };
    }
    static walk(directory) {
        const result = [];
        (function read(dir) {
            const files = fs_1.readdirSync(dir);
            for (const file of files) {
                const filepath = path_1.join(dir, file);
                if (fs_1.statSync(filepath).isDirectory())
                    read(filepath);
                else
                    result.push(filepath);
            }
        }(directory));
        return result;
    }
}
exports.Handler = Handler;
;
