import { Message, MessageEmbed } from "discord.js";
import { Player } from "lavaclient";
import { Util } from "../../../util/Util";
import { DecodedSong } from "../Helper";
import { Song } from "./Song";
import { stripIndents } from "common-tags";

export interface NowPlaying {
  position?: number;
  song?: string;
}

export interface Repeat {
  queue: boolean;
  song: boolean;
}

export class Queue {
  public next: string[] = [];
  public previous: string[] = [];
  public np: NowPlaying = { position: 0 };
  public repeat: Repeat = { song: false, queue: false };
  public ctx: Message;

  public constructor(public player: Player) {
    this.player
      .on("end", async (d) => {
        if (!["REPLACED"].includes(d.reason)) {
          if (!this.repeat.song) await this._next();
          if (this.repeat.queue && !this.np.song) {
            const previous = this.previous.reverse();
            await this.clear();
            this.add(...previous);
            await this._next();
          }

          if (!this.np.song) return this.leave();

          const next = this.ctx.client.music.decodeSong(this.np.song);
          await this.player.play(next.track);
          await this.announceNext(next);
        }
        ``;
      })
      .on("playerUpdate", (d: any) => (this.np.position = d.position))
      .on("error", (error) => {
        this.ctx.client.logger.error(
          typeof error === "string"
            ? error
            : `${error.severity}${error.cause ? `-${error.cause}` : ""}: ${
                error.message
              }`
        );

        return this.ctx.reply(stripIndents`
        Oh no! I ran into an error, please report this to the developers at our [support server](https://discord.gg/BnQECNd)
        \`\`\`js\n${
          typeof error === "string"
            ? error
            : `${error.severity} ${error.message}`
        }\`\`\`
        `);
      });
  }

  private _next(): void {
    if (this.np.song) this.previous.unshift(this.np.song);
    this.np.song = this.next.shift();
  }

  public async announceNext(np: DecodedSong) {
    if (this.ctx.guild.settings.get("announceNext")) {
      await this.ctx.channel.send(
        new MessageEmbed()
          .setColor(np.extra.color)
          .setAuthor(np.author)
          .setDescription(np.title)
          .setThumbnail(np.artwork)
      );
    }
  }

  public async leave() {
    await this.ctx.client.music.leave(this.ctx.guild.id);
    return this.ctx.reply(this.ctx.t("music.empty"));
  }

  public async start(ctx: Message): Promise<boolean> {
    this.ctx = ctx;
    if (!this.np.song) await this._next();
    return this.player.play(ctx.client.music.decodeSong(this.np.song).track);
  }

  public async add(...items: (Song | string)[]): Promise<number> {
    this.next.push(
      ...items.map((s) => (typeof s !== "string" ? Util.encodeSong(s) : s))
    );
    return this.next.length;
  }

  public async shuffle() {
    for (let i = this.next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.next[i], this.next[j]] = [this.next[j], this.next[i]];
    }
  }

  public clear(): void {
    this.next = [];
    this.previous = [];
    this.np = { song: null, position: 0 };
  }
}
