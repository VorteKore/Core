import ms from "ms";
import { Command, VorteMessage, VorteEmbed, get } from "@vortekore/lib";
import Verta from "../../plugins/Music";

export default class extends Command {
  public constructor() {
    super("botinfo", {
      aliases: ["status"],
      category: "Information"
    });
  }

  public async run(message: VorteMessage) {
    const emb = new VorteEmbed(message)
      .baseEmbed()
      .setAuthor(
        `${this.bot.user!.username} Bot Info`,
        this.bot.user!.displayAvatarURL()
      )
      .setDescription(
        `Hello, I'm ${
          this.bot.user!.username
        }!, I am a public bot. If you wish to check out the commands I have, please do \`!help\`.`
      )
      .addField("\u200B", this.buildStats());
    const commits = await this.getCommits();
    if (commits) emb.addField("Github Commits", commits);
    return message.channel.send(emb);
  }

  private buildStats() {
    let time = ms(this.bot.uptime!, { long: true });
    let fieldValue = "";
    fieldValue += `**Guild Count**: ${this.bot.guilds.size}\n`;
    fieldValue += `*Total Users**: ${this.bot.users.size}\n`;
    fieldValue += `**Total Commands**: ${this.bot.commands.size +
      (<Verta>(<any>this.bot).music).commands.length}\n`;
    fieldValue += `**Uptime:** ${time}\n`;
    fieldValue += `\n[Invite](http://bit.ly/VorteKore) • [Repository](https://github.com/VorteKore/) • [Vote](https://top.gg/bot/634766962378932224)`;
    return fieldValue;
  }

  private async getCommits() {
    let commits = await get<GithubCommits.RootCommit[]>(
        "https://api.github.com/repos/VorteKore/Core/commits"
      ),
      str = "";
    if (!commits.data) {
      this.logger.error(commits.error); 
      return false;
    }

    for (const { sha, html_url, commit, author } of commits.data
      .filter(c => c.committer.type.ignoreCase("user"))
      .slice(0, 5))
      str += `[\`${sha.slice(0, 7)}\`](${html_url}) ${commit.message} - ${
        author.login
      }\n`;

    return str;
  }
}
