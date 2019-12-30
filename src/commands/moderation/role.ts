import { Command, VorteMessage } from "@vortekore/lib";

export default class extends Command {
  public constructor() {
    super("role", {
      category: "Moderation",
      usage: "!role <add|remove> @member role",
      example: "!role remove @Chaos_Phoe#0001 Contributor",
      channel: "guild",
      disabled: true
    });
  }

  public async run(message: VorteMessage, args: string[]) {
    // if (!checkPermissions(message.member!, "MANAGE_ROLES"))
    //   return message.channel.send(
    //     new VorteEmbed(message).errorEmbed("Missing Permissions!")
    //   );
    // if (!args[0])
    //   return message.channel.send(
    //     new VorteEmbed(message).errorEmbed(
    //       "Provide if you want to add or remove the role!"
    //     )
    //   );
    // if (!args[1])
    //   return message.channel.send(
    //     new VorteEmbed(message).errorEmbed(
    //       "Provide a member to add/remove the role to!"
    //     )
    //   );
    // if (!args[2])
    //   return message.channel.send(
    //     new VorteEmbed(message).errorEmbed("Provide a role to add/remove!")
    //   );
    // const member =
    //   message.mentions.members!.first() ||
    //   message.guild!.members.find(x => x.displayName === args[1]) ||
    //   (await message.guild!.members.fetch(args[1]));
    // const role =
    //   message.mentions.roles.first() ||
    //   message.guild!.roles.find(r => r.name === args[2]) ||
    //   message.guild!.roles.get(args[2]);
    // if (!member)
    //   return message.channel.send(
    //     new VorteEmbed(message).errorEmbed("Unable to find the member.")
    //   );
    // if (!role)
    //   return message.channel.send(
    //     new VorteEmbed(message).errorEmbed("Unable to find the role.")
    //   );
    // if (args[0]!.toLowerCase() === "add") {
    //   member!.roles.add(role);
    //   message.channel.send(
    //     new VorteEmbed(message)
    //       .baseEmbed()
    //       .setDescription("Succesfully added the role.")
    //   );
    //   const { channel, enabled } = message._guild!.getLog("roleAdd");
    //   if (!enabled) return;
    //   message._guild!.getCase();
    //   const chan = message.guild!.channels.find(
    //     c => c.id === channel.id
    //   ) as TextChannel;
    //   chan.send(
    //     new VorteEmbed(message)
    //       .baseEmbed()
    //       .setTitle(`Moderation: Role Add [Case ID: ${guild.case}]`)
    //       .setDescription(
    //         `**>**Executor: ${message.author.tag} (${message.author.id})
    //       **>**User: ${member.user.tag} (${member.user.id})
    //       **>**Role Added: ${role.name}`
    //       )
    //       .setTimestamp()
    //   );
    // } else if (args[0] === "remove") {
    //   member!.roles.remove(role);
    //   message.channel.send(
    //     new VorteEmbed(message)
    //       .baseEmbed()
    //       .setDescription("Succesfully removed the role.")
    //   );
    //   const { channel, enabled } = message._guild.getLog("roleRemove");
    //   if (!enabled) return;
    //   guild.increaseCase();
    //   const chan = message.guild!.channels.find(
    //     c => c.id === channel.id
    //   ) as TextChannel;
    //   chan.send(
    //     new VorteEmbed(message)
    //       .baseEmbed()
    //       .setTitle(`Moderation: Role Remove [Case ID: ${guild.case}]`)
    //       .setDescription(
    //         `**>**Executor: ${message.author.tag} (${message.author.id})
    //       **>**User: ${member.user.tag} (${member.user.id})
    //       **>**Role Removed: ${role.name}`
    //       )
    //       .setTimestamp()
    //   );
    // } else {
    //   return message.channel.send("What do you want to do? `Add`/`Remove`");
    // }
  }
}
