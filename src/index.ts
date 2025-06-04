import pkg from '@prisma/generator-helper';
const { generatorHandler } = pkg;
import prettier from "prettier";
import fs from "fs";
import path from "path";

export default generatorHandler({
  onManifest() {
    return {
      prettyName: "Prisma Type Generator",

      config: {
        generateModelEnums: {
          default: false,
          type: "boolean",
          description: "Include enums not referenced by any model",
        }
      },
    };
  },
  async onGenerate(options) {
    const config = options.generator.config
    
    const outputDir = options.generator.output?.value ?? './types'

    const generateModelEnums = config.generateModelEnums === "true" || false;
      
    const EnumBlocks = options.dmmf.datamodel.enums ?? [];
    const modelBlocks = options.dmmf.schema?.enumTypes?.prisma ?? [];

    const enumBlocks = generateModelEnums
      ? [ ...modelBlocks, ...EnumBlocks ]
      : EnumBlocks;

    const enumsTs = enumBlocks
      .map((e) => {
        const members = e.values
          .map((v) => {
            const valueName = typeof v === "string" ? v : v.name;
            return `${valueName} = "${valueName}"`;
          })
          .join(",\n  ");
        return `export enum ${e.name} {\n  ${members}\n}`;
      })
      .join("\n\n");

    try {
      const enumsTsFormatted = await prettier.format(enumsTs, {
        trailingComma: "es5",
        tabWidth: 2,
        semi: true,
        singleQuote: false,
        useTabs: false,
        parser: "typescript",
      });

      await fs.promises.mkdir(outputDir, {
        recursive: true,
      });

      await fs.promises.writeFile(
        path.join(outputDir, "prisma.ts"),
        enumsTsFormatted
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});
