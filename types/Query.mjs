import { GraphQLObjectType } from "graphql";
import { account } from "../queries/account.mjs";

export const QueryType = new GraphQLObjectType({
  name: "Query",
  fields() {
    return {
      account,
    };
  },
});
