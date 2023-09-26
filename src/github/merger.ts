import { graphql } from "@octokit/graphql";
import { ActionLogger } from "./types";

// https://docs.github.com/en/graphql/reference/mutations#enablepullrequestautomerge
export const ENABLE_AUTO_MERGE = `
mutation($prId: ID!, $method: PullRequestMergeMethod!) {
    enablePullRequestAutoMerge(input: {pullRequestId: $prId, mergeMethod: $method}) {
        clientMutationId
         }
}`;

// https://docs.github.com/en/graphql/reference/mutations#disablepullrequestautomerge
export const DISABLE_AUTO_MERGE = `
mutation($prId: ID!) {
    disablePullRequestAutoMerge(input: {pullRequestId: $prId}) {
        clientMutationId
         }
}`;

export type MergeMethod = "SQUASH" | "MERGE" | "REBASE";

export class Merger {
    constructor(private readonly nodeId: string, private readonly gql: typeof graphql, private readonly logger: ActionLogger, private readonly mergeMethod: MergeMethod) {

    }

    async enableAutoMerge() {
        const mergeRequest = await this.gql<{ enablePullRequestAutoMerge: { clientMutationId: unknown } }>(ENABLE_AUTO_MERGE,
            {
                prId: this.nodeId,
                method: this.mergeMethod
            });
        this.logger.info("Succesfully enabled auto-merge");
    }

    async disableAutoMerge() {
        const mergeRequest = await this.gql<{ disablePullRequestAutoMerge: { clientMutationId: unknown } }>(DISABLE_AUTO_MERGE,
            {
                prId: this.nodeId
            });
        this.logger.info("Succesfully disabled auto-merge");
    }
}
