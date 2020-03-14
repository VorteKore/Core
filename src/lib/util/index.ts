import { Counter, Registry } from "prom-client";

export { ConfigData, default as Config, IConfig } from "./Config";
export * from "./Constants";
export * from "./functions";
export { default as QueueHook } from "./QueueHook";


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
