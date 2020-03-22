import { GuildMember, Message, TextChannel } from "discord.js";
import { CaseEntity, Command, confirm, VorteEmbed } from "../../../lib";

export default class extends Command {
  public constructor() {
    super("warn", {
      description: t => t("cmds:mod.warn.desc"),
      channel: "guild",
      aliases: ["warn"],
      userPermissions: ["MANAGE_GUILD"],
      args: [
        {
          id: "member",
          prompt: {
            start: (_: Message) => _.t("cmds:mod.memb", { action: "warn" })
          },
          type: "member"
        },
        {
          id: "reason",
          default: "None given",
          match: "rest"
        },
        {
          id: "yes",
          match: "flag",
          flag: ["-y", "--yes", ":y"]
        }
      ]
    });
  }

  public async exec(
    message: Message,
    {
      member,
      reason,
      yes
    }: { member: GuildMember; reason: string; yes: boolean }
  ) {
    if (message.deletable) await message.delete();
    if (member.id === message.member.id)
      return message
        .sem(message.t("cmds:mod.warn.ursf"), { type: "error" })
        .then(m => m.delete({ timeout: 6000 }));

    const mh = member.roles.highest,
      uh = message.member.roles.highest;
    if (mh.position >= uh.position)
      return message
        .sem(message.t("cmds:mod.hier", { mh, uh }), {
          type: "error"
        })
        .then(m => m.delete({ timeout: 6000 }));

    if (!yes) {
      const confirmed = await confirm(
        message,
        message.t("cmds:mod.confirm", { member, reason, action: "warn" })
      );
      if (!confirmed)
        return message
          .sem(message.t("cmds:mod.canc"))
          .then(m => m.delete({ timeout: 6000 }));
    }

    const profile = await this.client.ensureProfile(
      member.id,
      member.guild.id
    );
    ++profile.warns;

    await message
      .sem(message.t("cmds:mod.done", { member, reason, action: "Warned" }))
      .then(m => m.delete({ timeout: 6000 }));

    const _case = new CaseEntity(++message._guild.cases, message.guild.id);
    _case.reason = reason;
    _case.moderator = message.author.id;
    _case.subject = member.id;
    _case.type = "warn";

    await profile.save();
    await _case.save();
    await this.updateDb(message.guild, "cases", message._guild.cases);

    const log = (this.client as any).guild_manager.checkWarns(message, profile);
    if (!log) return;

    const { channel, enabled } = this.log(message._guild, "warn", "audit");
    if (!channel || !enabled) return;
    const logs = message.guild.channels.resolve(channel) as TextChannel;

    return logs.send(
      new VorteEmbed(message)
        .setAuthor(
          `Warn [ Case ID: ${_case.id} ]`,
          message.author.displayAvatarURL()
        )
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          [
            `**Staff Member**: ${message.author} \`(${message.author.id})\``,
            `**Victim**: ${member.user} \`(${member.id})\``,
            `**Reason**: ${reason}`
          ].join("\n")
        )
    );
  }
}
