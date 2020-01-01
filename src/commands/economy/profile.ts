import { createCanvas, loadImage } from "canvas";
import { MessageAttachment } from "discord.js";
import { formatNumber } from "../../util";
import { join } from "path";
import {
  Command,
  VorteMessage,
  ProfileEntity,
  VorteEmbed
} from "@vortekore/lib";

export default class extends Command {
  public constructor() {
    super("profile", {
      aliases: ["profile", "me"],
      description: "Displays your profile in an embed.",
      channel: "guild",
      usage: "[action] <value>",
      example: "!profile set bio I'm cool!",
      category: "Economy"
    });
  }

  public async run(message: VorteMessage, args: string[]) {
    switch (args[0]) {
      case "set":
        switch (args[1]) {
          case "bio":
          case "biography":
            message.profile!.bio = args.slice(2).join(" ");
            message.sem("Successfully updated your bio.");
            await message.profile!.save();
            break;
          default:
            message.sem("The only setting avaliable is **bio**");
            break;
        }
        break;
      default:
        const { level, xp } = message.profile!;
        let users = await ProfileEntity.find({
          where: { guildId: message.guild!.id }
        });
        users = users.sort((a, b) => b.xp - a.xp);
        const rank = users.findIndex(user => user.userId === message.author.id) + 1;

        const canvas = createCanvas(500, 200);
        const ctx = canvas.getContext("2d");
        const xpNeed = 2 * (75 * level);
        const image = await loadImage(join(process.cwd(), "images/rank-card.png"));
        const pfp = await loadImage(message.author.displayAvatarURL().replace(".webp", ".png"));
        const lineLength = Math.round((xp / xpNeed) * 458);

        ctx.lineWidth = 20;
        ctx.font = "18px Impact";
        ctx.fillStyle = "#00000";

        pfp.width = 310;
        pfp.height = 310;
        ctx.drawImage(pfp, 186, 36)
        ctx.drawImage(image, 0, 0);
        ctx.fillText(message.author.username, 33, 85);
        ctx.fillText(`[${formatNumber(level)}]`, 102, 155);
        ctx.fillText(`[${formatNumber(xp)}/${formatNumber(xpNeed)}]`, 400, 155);
        ctx.fillText(`#${formatNumber(rank)}`, 370, 60);
        ctx.moveTo(40, 170);
        ctx.lineTo(lineLength, 170);
        ctx.lineCap = "round";
        ctx.strokeStyle = "#4b62fa";
        ctx.stroke();

        const attachment = new MessageAttachment(
          canvas.toBuffer(),
          `RankCard-${message.author.username}.png`
        );
        const embed = new VorteEmbed(message)
          .baseEmbed()
          .setImage(`attachment://RankCard-${message.author.username}.png`);

        message.channel.send({ embed, files: [attachment] });
        break;
    }
  }
}
