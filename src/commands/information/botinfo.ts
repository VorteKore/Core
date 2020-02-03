import { Command, get, VorteEmbed } from "@vortekore/lib";
import { Message } from "discord.js";
import ms from "ms";

export default class extends Command {
  public constructor() {
    super("botinfo", {
      aliases: ["botinfo", "status"],
      description: {
        content: "Displays info on VorteKore"
      }
    });
  }

  public async exec(message: Message) {
    const emb = new VorteEmbed(message)
      .baseEmbed()
      .setAuthor(
        `${this.client.user!.username} Bot Info`,
        this.client.user!.displayAvatarURL()
      )
      .setDescription(
        `Hello, I'm ${
          this.client.user!.username
        }!, I am a public bot. If you wish to check out the commands I have, please do \`!help\`.`
      )
      .addField("\u200B", this.buildStats());
    const commits = await this.getCommits();
    if (commits) emb.addField("Github Commits", commits);
    return message.util.send(emb);
  }

  private buildStats() {
    let time = ms(this.client.uptime!, { long: true });
    return [
      `**Guild Count**: ${this.client.guilds.size}`,
      `**Total Users**: ${this.client.users.size}`,
      `**Total Commands**: ${this.client.commands.modules.size}`,
      `[Invite](http://bit.ly/VorteKore) • [Repository](https://github.com/VorteKore/) • [Vote](https://top.gg/bot/634766962378932224)`,
      `**Uptime:** ${time}`
    ].join("\n");
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
      .slice(0, 3))
      str += `[\`${sha.slice(0, 7)}\`](${html_url}) ${commit.message.trunc(50, true)} - ${
        author.login
      }\n`;

    return str;
  }
}
