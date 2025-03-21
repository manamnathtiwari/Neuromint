import { ethers } from 'ethers';
import { Octokit } from '@octokit/rest';
import { NeuroMint__factory } from '../../../typechain-types';
import axios from 'axios';

export class NeuroMintService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ReturnType<typeof NeuroMint__factory.connect>;
  private octokit: Octokit;
  private ollamaUrl: string;

  constructor(
    contractAddress: string,
    privateKey: string,
    rpcUrl: string,
    githubToken: string,
    ollamaUrl = 'http://localhost:11434/api/generate' // Default Ollama API endpoint
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = NeuroMint__factory.connect(contractAddress, this.wallet);
    this.ollamaUrl = ollamaUrl;

    this.octokit = new Octokit({
      auth: githubToken
    });
  }

  private async validateWithLLM(
    repoData: any,
    projectDescription: string
  ): Promise<{
    isValid: boolean;
    bonus: bigint;
  }> {
    try {
      const prompt = `
                You are a code review expert. Analyze this GitHub repository data and project description:
                Repository: ${JSON.stringify(repoData)}
                Project Description: ${projectDescription}
                
                Has the project met its goals based on the commits and changes?
                Respond with only 'true' or 'false' followed by a suggested bonus amount in wei (0 if false).
                Example responses:
                "true 1000000000000000" (for successful completion with bonus)
                "false 0" (for incomplete project)
            `;

      const response = await axios.post(this.ollamaUrl, {
        model: 'mistral', // Using Mistral model
        prompt,
        stream: false,
        options: {
          temperature: 0.3 // Lower temperature for more focused responses
        }
      });

      // Parse the response
      const result = response.data.response.trim().split(' ');
      const isValid = result[0].toLowerCase() === 'true';
      const bonus = BigInt(result[1] || '0');

      return { isValid, bonus };
    } catch (error) {
      console.error('LLM validation error:', error);
      return { isValid: false, bonus: BigInt(0) };
    }
  }

  async handleGithubWebhook(payload: any): Promise<void> {
    try {
      const { repository, sender } = payload;

      // Get repository details
      const repoData = await this.octokit.repos.get({
        owner: repository.owner.login,
        repo: repository.name
      });

      // Get commits from the last 24 hours
      const commits = await this.octokit.repos.listCommits({
        owner: repository.owner.login,
        repo: repository.name,
        since: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      });

      // Get project from contract
      const project = await this.contract.getProject(sender.id);

      if (!project || project.rewarded) {
        return;
      }

      // Validate with LLM
      const { isValid, bonus } = await this.validateWithLLM(
        { ...repoData.data, commits: commits.data },
        project.repoLink
      );

      if (isValid) {
        // Release reward with bonus
        await this.contract.releaseReward(sender.id, bonus);
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }
}
