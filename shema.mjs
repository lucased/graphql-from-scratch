import { GraphQLSchema } from "graphql";
import { QueryType } from "./types/Query.mjs";
import { AccountType } from "./types/Account.mjs";

const schema = new GraphQLSchema({
  query: QueryType,
  types: [AccountType],
});

export default schema;
