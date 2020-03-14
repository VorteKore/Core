import DBL from "dblapi.js";
import { Listener } from "../../../lib";
import WebServer from "../../../web/server";
import fetch from "node-fetch";

export default class BotReady extends Listener {
  public constructor() {
    super("bot-ready", {
      event: "ready",
      emitter: "client"
    });
  }

  async exec(client = this.client) {
    const server = new WebServer(client);
    await server.init();

    let activities = [
        `${client.guilds.cache.size.toLocaleString()} guilds!`,
        `${client.commands.modules
          .filter(c => c.categoryID !== "flag")
          .size.toLocaleString()} commands!`,
        `${client.users.cache.size.toLocaleString()} users!`
      ],
      i = 0;
    setInterval(
      () =>
        client.user.setActivity(
          `VorteKore | ${activities[i++ % activities.length]}`,
          { type: "STREAMING", url: "https://twitch.tv/melike2d" }
        ),
      10000
    );

    if (process.env.NODE_ENV === "production") {
      const dbl = new DBL(client.config.get("DBL_TOKEN"), this.client);
      setInterval(async () => {
        await dbl.postStats(this.client.guilds.cache.size);
        fetch(`https://api.botlist.space/v1/bots/${client.user.id}`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: client.config.get("BOTLIST.SPACE-TOKEN")
          },
          body: `{"server_count": ${client.guilds.cache.size}}`
        });
      }, 120000);
    }

    client.logger.info(`${client.user!.username} is ready to rumble!`);
  }
}
