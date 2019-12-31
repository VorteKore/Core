import { Command, VorteMessage, VorteEmbed, get } from "@vortekore/lib";

export default class extends Command {
  public constructor() {
    super("dog", {
      category: "Image",
      aliases: ["doggy"],
      cooldown: 3000,
      description: "Provides a dog pic from imgur",
      example: "!meme"
    });
  }

  public async run(message: VorteMessage) {
    const { data, error } = await get<ImgurHot.RootObject>(
      "https://www.imgur.com/r/dog/hot.json"
    );
    if (!data) {
      this.logger.error(error);
      return message.sem(`Sorry, we ran into an error :(`, { type: "error" });
    }

    const image = data.data[Math.floor(Math.random() * data.data.length)];
    return message.channel.send(
      new VorteEmbed(message)
        .baseEmbed()
        .setAuthor(image.author)
        .setTitle(image.title)
        .setURL(`https://imgur.com/${image.hash}`)
        .setImage(`https://imgur.com/${image.hash}${image.ext}`)
        .setFooter(`👀 ${image.views} ❤️ ${image.score}`)
    );
  }
}
