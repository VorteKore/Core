import { Message, MessageEmbed } from "discord.js";
import { EventEmitter } from "events";
import { Player } from "lavalink";

export interface NowPlaying {
  position?: number;
  song?: string;
  skips: Set<string>;
}

export interface Repeat {
  queue: boolean;
  song: boolean;
}

export default class Queue extends EventEmitter {
  public next: Array<string> = [];
  public message: Message;
  public previous: Array<string> = [];
  public repeat: Repeat = { queue: false, song: false };
  public np: NowPlaying = { position: 0, skips: new Set() };

  public constructor(public readonly player: Player) {
    super();

    this.player.queue = this;
    this.player
      .on("event", async (d: { [key: string]: any }) => {
        if (
          d.type !== "TrackEndEvent" ||
          !["REPLACED", "STOPPED"].includes(d.reason)
        ) {
          if (!this.repeat.song) await this._next();
          if (this.repeat.queue && !this.np.song) {
            // tslint:disable-next-line: no-misleading-array-reverse
            const previous = this.previous.reverse();
            await this.clear();
            this.add(...previous);
            await this._next();
          }

          if (!this.np.song) {
            await this.message.sem(`No more songs in the queue. Bye 👋!`, {
              _new: true
            });
            await this.player.leave();
            await this.player.destroy();
            return;
          }
          this.emit("next", this.np);
          await this.player.play(this.np.song);
          if (this.message._guild.announceNextTrack) {
            const np = this.message.client.decode(this.np.song);
            await this.message.channel.send(
              new MessageEmbed()
                .setAuthor(np.author)
                .setColor(this.message._guild.embedColor)
                .setDescription(`[${np.title}](${np.uri})`)
                .setThumbnail(
                  `https://i.ytimg.com/vi/${np.identifier}/hqdefault.jpg`
                )
            );
          }
        }
      })
      .on("playerUpdate", d => {
        this.np.position = d.state.position;
      });
  }

  public add(...songs: Array<string>): number {
    if (!songs.length) return 0;
    return this.next.push(...songs);
  }

  public async _next() {
    const next = this.next.shift();
    if (this.np.song) this.previous.unshift(this.np.song);
    this.np = { song: next, position: 0, skips: new Set() };
  }

  public async start(message: Message): Promise<boolean> {
    this.message = message;
    if (!this.np.song) await this._next();
    await this.player.play(this.np.song);
    return this.emit("start", this.np);
  }

  public async stop(): Promise<void> {
    return this.player.stop();
  }

  public async setVolume(vol: number): Promise<void> {
    this.player.volume = vol;
    return this.player.setVolume(vol);
  }

  public async move(from: number, to: number): Promise<Array<string>> {
    if (to >= this.next.length) {
      let k = to - this.next.length + 1;
      while (k--) {
        this.next.push(undefined as any);
      }
    }

    this.next.splice(to, 0, this.next.splice(from, 1)[0]);
    return this.next;
  }

  public length(): number {
    return this.next.length;
  }

  public sort(predicate?: (a: string, b: string) => number): Array<string> {
    return this.next.sort(predicate);
  }

  public async clear(stop: boolean = false): Promise<void> {
    this.next = [];
    this.previous = [];
    this.np = { position: 0, skips: new Set() };
    if (stop) await this.stop();
  }
}
