import path from "path";
import { promises as fs } from "fs";
import { EventNames, Module, ModuleMap } from "@amplication/code-gen-types";
import { MAIN_TS_FILE_NAME, MAIN_TS_WITH_BIGINT_FILE_NAME } from "../constants";
import DsgContext from "../../dsg-context";
import { formatCode } from "@amplication/code-gen-utils";
import pluginWrapper from "../../plugin-wrapper";

export async function createMainFile(): Promise<Module[]> {
  return pluginWrapper(createMainFileInternal, EventNames.CreateServerMain, {});
}

async function createMainFileInternal() {
  const { logger, serverDirectories, hasBigIntFields } = DsgContext.getInstance;
  const moduleMap = new ModuleMap(logger);

  await logger.info("Creating main.ts file...");

  const mainFilePath = path.resolve(__dirname, MAIN_TS_FILE_NAME);
  const mainWithBigintFilePath = path.resolve(
    __dirname,
    MAIN_TS_WITH_BIGINT_FILE_NAME
  );
  const mainFileContent = await fs.readFile(mainFilePath, "utf-8");
  const mainWithBigintFileContent = await fs.readFile(
    mainWithBigintFilePath,
    "utf-8"
  );

  const mainModule: Module = {
    path: path.join(serverDirectories.srcDirectory, MAIN_TS_FILE_NAME),
    code: mainFileContent,
  };

  const mainWithBigintModule: Module = {
    path: path.join(
      serverDirectories.srcDirectory,
      MAIN_TS_WITH_BIGINT_FILE_NAME.replace(".with-bigint", "")
    ),
    code: mainWithBigintFileContent,
  };

  if (hasBigIntFields) {
    await moduleMap.set(mainWithBigintModule);
  } else {
    await moduleMap.set(mainModule);
  }

  await logger.info("Formatting main.ts file...", { PATH: mainModule.path });
  await moduleMap.replaceModulesPath((path) => path.replace(".template", ""));
  await moduleMap.replaceModulesCode((path, code) => formatCode(path, code));

  await logger.warn("ModuleMap", { MODULE_MAP: moduleMap });
  await logger.warn("main.ts file content", {
    CODE: moduleMap.get(mainModule.path),
  });

  return moduleMap;
}
