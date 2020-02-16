import {CaseEntity, Command, confirm, VorteEmbed} from "@vortekore/lib";
import {GuildMember, Message, TextChannel} from "discord.js";
import ms from "ms";

export default class extends Command {
	public constructor() {
		super("mute", {
			aliases: ["mute"],
			description: t => t("cmds:mod.mute.desc"),
			userPermissions: ["MUTE_MEMBERS"],
			channel: "guild",
			args: [
				{
					id: "member",
					prompt: {
						start: (_: Message) => _.t("cmds:mod.purp", {action: "mute"})
					},
					type: "member"
				},
				{
					id: "time",
					prompt: {
						start: (_: Message) => _.t("cmds:mod.mute.purp")
					},
					type: "string"
				},
				{
					id: "reason",
					prompt: {
						start: (_: Message) => _.t("cmds:mod.purp", {action: "mute"})
					},
					match: "rest"
				}
			]
		});
	}

	public async exec(
		message: Message,
		{
			member,
			time,
			reason
		}: { member: GuildMember; time: string; reason: string }
	) {
		if (message.deletable) await message.delete();
		if (member.id === message.member.id)
			return message
				.sem(message.t("cmds:mod.mute.ursf"), {
					type: "error"
				})
				.then(m => m.delete({timeout: 6000}));

		const mh = member.roles.highest,
			uh = message.member.roles.highest;
		if (mh.position >= uh.position)
			return message
				.sem(message.t("cmds:mod.hier", {mh, uh}), {type: "error"})
				.then(m => m.delete({timeout: 6000}));

		const muteTime = ms(time);

		const confirmed = await confirm(
			message,
			message.t("cmds:mod.confirm", {
				member,
				reason,
				action: "mute"
			})
		);
		if (!confirmed)
			return message
				.sem("Okay, your choice!")
				.then(m => m.delete({timeout: 6000}));

		let muteRole = message.guild.roles.resolve(message._guild.muteRole);
		try {
			if (!muteRole) {
				const confirmed = await confirm(
					message,
					message.t("cmds:mod.mute.mtr_confirm")
				);
				if (!confirmed)
					return message
						.sem(message.t("cmds:mod.mute.create_mtr"))
						.then(m => m.delete({timeout: 6000}));
				muteRole = await message.guild.roles.create({
					data: {
						name: "Muted",
						permissions: 0,
						color: "#1f1e1c"
					}
				});

				message._guild.muteRole = muteRole.id;
				for (const [, cg] of message.guild.channels.cache.filter(
					c => c.type === "category"
				))
					await cg.createOverwrite(
						muteRole,
						{
							SEND_MESSAGES: false
						},
						"new mute role"
					);
			}

			await member.roles.add(muteRole, reason);
			message
				.sem(message.t("cmds:mod.done", {member, action: "Muted", reason}))
				.then(m => m.delete({timeout: 6000}));
		} catch (error) {
			this.logger.error(error, "ban");
			return message
				.sem(message.t("cmds:mod.error", {member, action: "mute"}), {
					type: "error"
				})
				.then(m => m.delete({timeout: 10000}));
		}

		const _case = new CaseEntity(++message._guild.cases, member.guild.id);
		_case.reason = reason;
		_case.moderator = message.author.id;
		_case.subject = member.id;
		_case.type = "ban";
		_case.other = {finished: false, muteTime};

		await _case.save();
		await message._guild.save();

		const {channel, enabled} = message._guild.log("mute", "audit");
		if (!channel || !enabled) return;
		const logs = message.guild.channels.resolve(channel) as TextChannel;

		return logs.send(
			new VorteEmbed(message)
				.baseEmbed()
				.setAuthor(
					`Mute [ Case ID: ${_case.id} ]`,
					message.author.displayAvatarURL()
				)
				.setThumbnail(this.client.user.displayAvatarURL())
				.setDescription(
					[
						`**Staff Member**: ${message.author} \`(${message.author.id})\``,
						`**Victim**: ${member.user} \`(${member.id})\``,
						`**Reason**: ${reason}`,
						`**Mute Time**: ${ms(muteTime, {long: true})}`
					].join("\n")
				)
		);
	}
}
