import { GraphQLObjectType, GraphQLString } from "graphql";
import { getBalance } from "../lib/ethers.mjs";

export const AccountType = new GraphQLObjectType({
  name: "Account",
  fields: {
    balance: {
      type: GraphQLString,
      resolve: async ({ address }, args, context, info) => {
        const balance = await getBalance(address);
        return balance;
      },
    },
  },
});
