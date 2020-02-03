import { Command, VorteEmbed, get } from "@vortekore/lib";
import { Message } from "discord.js";

export default class extends Command {
  public constructor() {
    super("duck", {
      aliases: ["duck", "ducky"],
      description: {
        content: "Provides a duck pic from r/duck"
      }
    });
  }

  public async exec(message: Message) {
    const { data, error } = await get<RedditTopJSON.RootObject>(
      "https://www.reddit.com/r/duck.json?limit=100"
    );
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    const images = data.data.children.filter(
        post => post.data.post_hint === "image"
      ),
      image = images[Math.floor(Math.random() * images.length)].data;
    return message.util.send(
      new VorteEmbed(message)
        .baseEmbed()
        .setAuthor(image.author)
        .setTitle(image.title)
        .setURL(`https://reddit.com${image.permalink}`)
        .setImage(image.url)
        .setFooter(`👍 ${image.ups}`)
    );
  }
}
