import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
class ModelGroupResource {
  @Field(() => String, {
    nullable: false,
    description:
      "The id of the existing resource or a temporary id for the new resource",
  })
  id!: string;

  @Field(() => String, {
    nullable: false,
    description: "The name of the resource (microservice)",
  })
  name!: string;
}

@ObjectType({
  isAbstract: true,
})
class CopiedEntity {
  @Field(() => String, {
    nullable: false,
    description: "The id of the entity to copy",
  })
  entityId!: string;

  @Field(() => String, {
    nullable: false,
    description: "The name of the entity to copy",
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
    description: "The id of the resource to copy the entity from",
  })
  originalResourceId!: string;

  @Field(() => String, {
    nullable: false,
    description: "The id of the resource to copy the entity to",
  })
  targetResourceId!: string;
}

@ObjectType({
  isAbstract: true,
})
export class AiRecommendations {
  @Field(() => [ModelGroupResource], {
    nullable: false,
    description: "The resources (microservices) generated by the ai",
  })
  newResources!: ModelGroupResource[];

  @Field(() => [CopiedEntity], {
    nullable: false,
    description: "The entities with changed parent resource",
  })
  copiedEntities!: CopiedEntity[];
}
