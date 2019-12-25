import { GuildMember, VoiceChannel } from "discord.js";
import { Node, Player, PlayerOptions } from "discord.js-andesite";
import { VorteMessage } from "../classes/Message";
import { VorteQueue } from "./VorteQueue";

export class VortePlayer extends Player {
  public readonly queue: VorteQueue = new VorteQueue(this);
  public message!: VorteMessage;
  public bass: "high" | "medium" | "low" | "none" = "none";
  public channel: VoiceChannel;

  public constructor(node: Node, options: PlayerOptions) {
    super(node, options);
    this.channel = <VoiceChannel>node.manager.client.channels.get(options.channelId);
  }

  public useMessage(message: VorteMessage): VortePlayer {
    this.message = message;
    return this;
  }

  public in(member: GuildMember): boolean {
    const channel = <VoiceChannel>member.guild.channels.get(this.channel.id);
    return channel.members.has(member.user.id);
  }
}