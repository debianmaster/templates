import { Output, Services } from "~templates-utils";
import { Input } from "./meta";

export function generate(input: Input): Output {
  const services: Services = [];

  services.push({
    type: "app",
    data: {
      serviceName: input.appServiceName,
      env: [`PUID=1000`, `PGID=1000`, `TZ=${input.serviceTimezone}`].join("\n"),
      source: {
        type: "image",
        image: input.appServiceImage,
      },
      domains: [
        {
          host: "$(EASYPANEL_DOMAIN)",
          port: 80,
        },
      ],
      mounts: [
        {
          type: "volume",
          name: "config",
          mountPath: "/app/data/configs",
        },
        {
          type: "volume",
          name: "icons",
          mountPath: "/app/public/icons",
        },
      ],
    },
  });

  return { services };
}
