import { Listener } from "../../../lib";
import DBL from "dblapi.js";
import WebServer from "../../../web/server";

export default class BotReady extends Listener {
  public constructor() {
    super("bot-ready", {
      event: "ready",
      emitter: "client"
    });
  }

  async exec(client = this.client) {
    (this.client as any).guild_manager.onReady();
    // new WebServer(client).init();
    client.user!.setPresence({
      activity: {
        name: "VorteKore | v!help",
        type: "STREAMING",
        url: "https://twitch.tv/vortekore"
      }
    });

    if (process.env.NODE_ENV === "production") {
      const dbl = new DBL(client.config.get("DBL_TOKEN"), this.client);
      setInterval(() => dbl.postStats(this.client.guilds.cache.size), 120000);
    }

    client.logger.info(`${client.user!.username} is ready to rumble!`);
  }
}
