import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { ethers } from 'ethers';
import { useAccount, useConnect, useContractWrite } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { NEUROMINT_ABI, NEUROMINT_ADDRESS } from '@/lib/constants';

export default function NeuroMintPage() {
  const [repoLink, setRepoLink] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector()
  });

  const { write: submitProject } = useContractWrite({
    address: NEUROMINT_ADDRESS,
    abi: NEUROMINT_ABI,
    functionName: 'submitProject'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      connect();
      return;
    }

    const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);
    submitProject({
      args: [repoLink, deadlineTimestamp],
      value: ethers.parseEther('0.01')
    });
  };

  return (
    <div className='container mx-auto py-8'>
      <Card className='mx-auto max-w-2xl'>
        <CardHeader>
          <CardTitle>Submit Your Project</CardTitle>
          <CardDescription>
            Submit your GitHub project and deposit ETH to start the validation
            process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='repo'>GitHub Repository Link</Label>
              <Input
                id='repo'
                placeholder='https://github.com/username/repo'
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Project Description</Label>
              <Textarea
                id='description'
                placeholder='Describe your project and its goals...'
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='deadline'>Project Deadline</Label>
              <Input
                id='deadline'
                type='datetime-local'
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <Button type='submit' className='w-full'>
              {isConnected ? 'Submit Project' : 'Connect Wallet'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
