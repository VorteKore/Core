import { Message, MessageEmbed, MessageReaction, User } from "discord.js";
import fetch, { RequestInit } from "node-fetch";
import { Counter, Registry } from "prom-client";
import { Category, Command } from "discord-akairo";
import { developers } from "./Constants";

export { ConfigData, default as Config, IConfig } from "./Config";

export * from "./functions";
export * from "./Constants";
export { default as QueueHook } from "./QueueHook";

export function CategoryPredicate(message: Message) {
  return (c: Category<string, Command>) =>
    ![
      "flag",
      ...(developers.includes(message.author.id)
        ? []
        : message.member.hasPermission("MANAGE_GUILD", {
            checkAdmin: true,
            checkOwner: true
          })
        ? ["developer"]
        : ["staff", "settings", "developer"])
    ].includes(c.id);
}

export function trunc(
  str: string,
  n: number,
  useWordBoundary: boolean
): string {
  if (str.length <= n) return str;
  let subString = str.substr(0, n - 1);
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
}

export const get = async <T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: Error }> => {
  return new Promise(resolve => {
    return fetch(url, options).then(
      async res => resolve({ data: await res.json() }),
      error => resolve({ error })
    );
  });
};

export const readPath = (object: string[], data: any): any => {
  if (object.length > 0) {
    data = data[object[0]];
    if (!data) return;
    return readPath(object.slice(1), data);
  }
  return data;
};

export function confirm(message: Message, content: string): Promise<Boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const embed = new MessageEmbed()
          .setColor("#36393f")
          .setAuthor(message.author.username, message.author.displayAvatarURL())
          .setDescription(content),
        emotes = ["✅", "❌"],
        m = <Message>await message.util!.send(embed);
      await Promise.all(emotes.map(m.react.bind(m)));

      m.awaitReactions(
        (r: MessageReaction, u: User) =>
          emotes.includes(r.emoji.name) && u.id === message.author.id,
        {
          errors: ["time"],
          max: 1,
          time: 15000
        }
      )
        .then(async reacted => {
          await m.reactions.removeAll();
          if (!reacted.size) return resolve(false);
          return resolve(reacted.first().emoji.name === "✅");
        })
        .catch(() => resolve(false));
    } catch (error) {
      message.client.logger.error(error, `Functions#confirm`);
      return reject(error);
    }
  });
}

export interface PaginateResults<T> {
  items: T[];
  page: number;
  maxPage: number;
  pageLength: number;
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageLength = 10
): PaginateResults<T> {
  const maxPage = Math.ceil(items.length / pageLength);
  if (page < 1) page = 1;
  if (page > maxPage) page = maxPage;
  const startIndex = (page - 1) * pageLength;

  return {
    items:
      items.length > pageLength
        ? items.slice(startIndex, startIndex + pageLength)
        : items,
    page,
    maxPage,
    pageLength
  };
}

String.prototype.capitalize = function() {
  return this.slice(0, 1).toUpperCase() + this.slice(1).toLowerCase();
};

String.prototype.trunc = function(n: number, useWordBoundary: boolean) {
  if (this.length <= n) {
    return this;
  }

  const subString = this.substr(0, n - 1);
  return (
    (useWordBoundary
      ? subString.substr(0, subString.lastIndexOf(" "))
      : subString) + "..."
  );
};

String.prototype.ignoreCase = function(value: string): boolean {
  return this.toLowerCase() === value.toLowerCase();
};

declare global {
  interface String {
    capitalize(): string;
    ignoreCase(value: string): boolean;
    trunc(n: number, useWordBoundary?: boolean): String;
  }

  interface ObjectConstructor {
    keys<T extends object>(o: T): (keyof T)[];
  }
}

export type Stats = {
  commands: Counter<string>;
  messages: Counter<string>;
  register: Registry;
};
