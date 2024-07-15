import { Output, randomPassword, Services } from "~templates-utils";
import { Input } from "./meta";

export function generate(input: Input): Output {
  const services: Services = [];
  const postgresPassword = randomPassword();

  services.push({
    type: "app",
    data: {
      projectName: input.projectName,
      serviceName: input.appServiceName,
      env: [
        `SELF_HOSTING_ENABLED=true`,
        `RAILS_FORCE_SSL=false`,
        `RAILS_ASSUME_SSL=false`,
        `GOOD_JOB_EXECUTION_MODE=async`,
        `SECRET_KEY_BASE=${input.secretKeyBase}`,
        `DB_HOST=${input.databaseServiceName}`,
        `POSTGRES_DB=${input.databaseName}`,
        `POSTGRES_USER=${input.databaseUser}`,
        `POSTGRES_PASSWORD=${postgresPassword}`,
      ].join("\n"),
      source: {
        type: "image",
        image: input.appServiceImage,
      },
      domains: [
        {
          host: "$(EASYPANEL_DOMAIN)",
          port: 3000,
        },
      ],
      mounts: [
        {
          type: "volume",
          name: "app-storage",
          mountPath: "/rails/storage",
        },
      ],
    },
  });

  services.push({
    type: "postgres",
    data: {
      projectName: input.projectName,
      serviceName: input.databaseServiceName,
      env: [
        `POSTGRES_USER=${input.databaseUser}`,
        `POSTGRES_DB=${input.databaseName}`,
        `POSTGRES_PASSWORD=${postgresPassword}`,
      ].join("\n"),
      source: {
        type: "image",
        image: input.databaseServiceImage,
      },
      mounts: [
        {
          type: "volume",
          name: "postgres-data",
          mountPath: "/var/lib/postgresql/data",
        },
      ],
      healthcheck: {
        test: ["CMD-SHELL", "pg_isready -U $POSTGRES_USER -d $POSTGRES_DB"],
        interval: "5s",
        timeout: "5s",
        retries: 5,
      },
    },
  });

  return { services };
}
