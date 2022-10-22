import { GraphQLString } from "graphql";
import { AccountType } from "../types/Account.mjs";

export const account = {
    type: AccountType,
    description: "Get account information",
    args: {
      address: {
        type: GraphQLString,
        description: "Account address",
      },
    },
    resolve: async (root, args, context, info) => {
      return {
        address: args.address,
      };
    },
  };