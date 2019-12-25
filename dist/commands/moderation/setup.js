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
const lib_1 = require("../../lib");
const Command_1 = require("../../lib/classes/Command");
const util_1 = require("../../util");
class default_1 extends Command_1.Command {
    constructor() {
        super("setup", {
            category: "Moderation",
            cooldown: 200,
            usage: "!setup <toSetup>",
            example: "!setup prefix"
        });
    }
    run(message, args, guild = message.getGuild()) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args[0])
                return message.channel.send(new lib_1.VorteEmbed(message)
                    .baseEmbed()
                    .setDescription("What do you want to setup?")
                    .addField(`prefix`, `Changes the current prefix of the server\nUsage: ${guild.prefix}setup prefix <new prefix>`)
                    .addField(`staff`, `Add/Remove a provided role from staff roles\nUsage: ${guild.prefix}setup staff <add|remove> @role`)
                    .addField(`ar`, `Adds a role when a user joins the guild.\nUsage: ${guild.prefix}setup ar <add> <ID OF THE ROLE>`)
                    .addField(`welcome|leave`, `disable: disable the welcome/leave message\nchannel: Sets the default channel for welcome/leave #channel\nmessage: Sets the default message **Use {{mention}} to tag them {{member}} for the name {{server}} for the server name and {{memberCount}} for the memberCount**\nUsage: ${guild.prefix}setup <welcome|leave> <disable|message|channel> <message|#channel>`)
                    .addField(`logs`, `logs available: \`deleteMessage\`,\`editMessage\`,\`ban\`,\`kick\`,\`mute\`,\`warn\`,\`lockdown\`,\`slowmode\`,\`roleRemove\`,\`roleAdd\`,\`channel\`\n\nUsage: To setup the channel: ${guild.prefix}setup logs channel #channel\nTo enable/disable: ${guild.prefix}setup logs <logname> enable/disable.`));
            const toSetup = args[0].toLowerCase();
            if (toSetup === "prefix") {
                if (!util_1.checkPermissions(message.member, "ADMINISTRATOR"))
                    return message.channel.send(`Missing Permissions for using this command.`);
                if (!args[1])
                    message.channel.send(new lib_1.VorteEmbed(message).baseEmbed().setTitle(`Please use \`${guild.prefix}prefix\` to see the current prefix.`));
                guild.setPrefix(args[1]);
                message.channel.send(`Successfully changed the prefix to ${args[1]}`);
            }
            else if (toSetup === "staff" || toSetup === "ar") {
                if (!args[2])
                    return message.reply("What role to add/remove?");
                const role = util_1.findRole(message, args.slice(2).join(" ").toLowerCase());
                if (!role)
                    message.reply("Couldn't find that role");
                if (args[1] === "add")
                    guild.addRole(toSetup, role.name);
                else if (args[1] === "remove")
                    guild.removeRole(toSetup, role.name);
                else
                    message.reply("N0");
            }
            else if (toSetup === "welcome" || toSetup === "leave") {
                if (args[1] === "disable")
                    guild.setAutoMessage(toSetup, "enabled", false);
                if (args[1] === "enable")
                    guild.setAutoMessage(toSetup, "enabled", true);
                else if (args[1] === "message") {
                    guild.setAutoMessage(toSetup, "message", args.slice(2).join(" "));
                    message.channel.send(`Successfully set message to: ${args.slice(2).join(" ")}`);
                }
                else if (args[1] === "channel") {
                    const channel = message.mentions.channels.first();
                    if (!channel)
                        return message.reply("Mention a channel to set");
                    guild.setAutoMessage(toSetup, "channel", channel.id);
                    message.channel.send(`Successfully set channel to ${channel.name}`);
                }
                else
                    message.reply("What to set?");
            }
            else if (toSetup === "logs") {
                if (args[1] === "channel") {
                    const channel = message.mentions.channels.first();
                    message.channel.send(`Succesfully setup the logs channel to ${channel}`);
                    if (!channel)
                        return message.reply("Mention a channel to set");
                    guild.setLog("channel", channel.id);
                }
                else if ([
                    "deleteMessage",
                    "editMessage",
                    "ban",
                    "kick",
                    "mute",
                    "warn",
                    "lockdown",
                    "slowmode",
                    "roleRemove",
                    "roleAdd",
                    "channel"
                ].includes(args[1])) {
                    if (!["enable", "disable"].includes(args[2]))
                        return message.reply("Do you want to enable or disable it?");
                    guild.setLog(args[1], args[2]);
                    message.channel.send("Done!");
                }
                else
                    message.reply("What to set?");
            }
        });
    }
}
exports.default = default_1;
