'use client';

import { useState } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function AWSCommands() {
    const [activeTab, setActiveTab] = useState('login');
    const [activeEc2Option, setActiveEc2Option] = useState('list');
    const [activeS3Option, setActiveS3Option] = useState('list-buckets');
    
    // EC2 state
    const [instanceId, setInstanceId] = useState('{instance-id}');
    const [keyFile, setKeyFile] = useState('{key-file.pem}');
    const [instanceIp, setInstanceIp] = useState('{instance-public-ip}');
    
    // S3 state
    const [bucketName, setBucketName] = useState('{bucket-name}');
    const [s3Path, setS3Path] = useState('{path}');
    const [localFile, setLocalFile] = useState('{local-file}');
    const [localDirectory, setLocalDirectory] = useState('{local-directory}');

    const tabs = [
        { id: 'login', label: 'Login & Setup' },
        { id: 'ec2', label: 'EC2' },
        { id: 's3', label: 'S3' }
    ];

    const ec2Options = [
        { id: 'list', label: 'List Instances' },
        { id: 'start', label: 'Start Instance' },
        { id: 'stop', label: 'Stop Instance' },
        { id: 'ssh', label: 'SSH into Instance' }
    ];

    const s3Options = [
        { id: 'list-buckets', label: 'List Buckets' },
        { id: 'list-objects', label: 'List Objects' },
        { id: 'copy-to', label: 'Copy to S3' },
        { id: 'copy-from', label: 'Copy from S3' },
        { id: 'sync-to', label: 'Sync to S3' },
        { id: 'sync-from', label: 'Sync from S3' }
    ];

    const getEc2Command = () => {
        switch (activeEc2Option) {
            case 'list':
                return 'aws ec2 describe-instances';
            case 'start':
                return `aws ec2 start-instances --instance-ids ${instanceId}`;
            case 'stop':
                return `aws ec2 stop-instances --instance-ids ${instanceId}`;
            case 'ssh':
                return `ssh -i ${keyFile} ec2-user@${instanceIp}`;
            default:
                return '';
        }
    };

    const getEc2Description = () => {
        switch (activeEc2Option) {
            case 'list':
                return 'List all EC2 instances';
            case 'start':
                return 'Start a stopped EC2 instance';
            case 'stop':
                return 'Stop a running EC2 instance';
            case 'ssh':
                return 'Connect to EC2 instance via SSH';
            default:
                return '';
        }
    };

    const getS3Command = () => {
        switch (activeS3Option) {
            case 'list-buckets':
                return 'aws s3 ls';
            case 'list-objects':
                return `aws s3 ls s3://${bucketName}`;
            case 'copy-to':
                return `aws s3 cp ${localFile} s3://${bucketName}/${s3Path}`;
            case 'copy-from':
                return `aws s3 cp s3://${bucketName}/${s3Path} ${localFile}`;
            case 'sync-to':
                return `aws s3 sync ${localDirectory} s3://${bucketName}/${s3Path}`;
            case 'sync-from':
                return `aws s3 sync s3://${bucketName}/${s3Path} ${localDirectory}`;
            default:
                return '';
        }
    };

    const getS3Description = () => {
        switch (activeS3Option) {
            case 'list-buckets':
                return 'List all S3 buckets';
            case 'list-objects':
                return 'List all objects in a specific bucket';
            case 'copy-to':
                return 'Upload a file to S3 bucket';
            case 'copy-from':
                return 'Download a file from S3 bucket';
            case 'sync-to':
                return 'Sync local directory to S3 (upload all files)';
            case 'sync-from':
                return 'Sync S3 bucket to local directory (download all files)';
            default:
                return '';
        }
    };

    const renderEc2Inputs = () => {
        if (activeEc2Option === 'list') {
            return null;
        }
        
        if (activeEc2Option === 'ssh') {
            return (
                <div className="space-y-3 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Key File</label>
                        <input
                            type="text"
                            value={keyFile}
                            onChange={(e) => setKeyFile(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., /path/to/key.pem"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Instance Public IP</label>
                        <input
                            type="text"
                            value={instanceIp}
                            onChange={(e) => setInstanceIp(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., 54.123.45.67"
                        />
                    </div>
                </div>
            );
        }
        
        // start and stop
        return (
            <div className="mt-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Instance ID</label>
                <input
                    type="text"
                    value={instanceId}
                    onChange={(e) => setInstanceId(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-700 text-white"
                    placeholder="e.g., i-1234567890abcdef0"
                />
            </div>
        );
    };

    const renderS3Inputs = () => {
        if (activeS3Option === 'list-buckets') {
            return null;
        }
        
        if (activeS3Option === 'list-objects') {
            return (
                <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Bucket Name</label>
                    <input
                        type="text"
                        value={bucketName}
                        onChange={(e) => setBucketName(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                        placeholder="e.g., my-bucket"
                    />
                </div>
            );
        }
        
        if (activeS3Option === 'copy-to' || activeS3Option === 'copy-from') {
            return (
                <div className="space-y-3 mt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Bucket Name</label>
                        <input
                            type="text"
                            value={bucketName}
                            onChange={(e) => setBucketName(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., my-bucket"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">S3 Path</label>
                        <input
                            type="text"
                            value={s3Path}
                            onChange={(e) => setS3Path(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., folder/file.txt or folder/"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Local File</label>
                        <input
                            type="text"
                            value={localFile}
                            onChange={(e) => setLocalFile(e.target.value)}
                            className="w-full p-2 rounded-md bg-gray-700 text-white"
                            placeholder="e.g., /path/to/file.txt"
                        />
                    </div>
                </div>
            );
        }
        
        // sync-to and sync-from
        return (
            <div className="space-y-3 mt-2">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Bucket Name</label>
                    <input
                        type="text"
                        value={bucketName}
                        onChange={(e) => setBucketName(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                        placeholder="e.g., my-bucket"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">S3 Path</label>
                    <input
                        type="text"
                        value={s3Path}
                        onChange={(e) => setS3Path(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                        placeholder="e.g., folder/ or folder/subfolder/"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Local Directory</label>
                    <input
                        type="text"
                        value={localDirectory}
                        onChange={(e) => setLocalDirectory(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-white"
                        placeholder="e.g., /path/to/directory"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold !text-blue-400 mb-4">AWS</h3>
            <div className="flex space-x-2 overflow-x-auto p-1.5 tab-bg rounded-lg mb-4 shadow-sm dark:shadow-none">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm whitespace-nowrap font-medium rounded-md transition-colors ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white !cursor-default shadow-md'
                                : 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-1 component-bg rounded-lg">
                {activeTab === 'login' && (
                    <>
                        <h4 className="text-lg font-quicksand font-medium mb-2">AWS Login & Configuration</h4>
                        <div className="text-sm description mb-3">Configure AWS CLI credentials and authentication</div>
                        <div className="mt-4">
                            <CodeSnippet code="aws configure" language="bash" />
                        </div>
                        <div className="mt-4 space-y-4">
                            <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                                <div className="text-sm font-medium description !text-blue-400 mb-2">Configuration Details:</div>
                                <div className="text-sm text-gray-300 font-quicksand space-y-2">
                                    <div>You'll be prompted for:</div>
                                    <div>• <strong>AWS Access Key ID:</strong> Your access key</div>
                                    <div>• <strong>AWS Secret Access Key:</strong> Your secret key</div>
                                    <div>• <strong>Default region:</strong> e.g., us-east-1, eu-west-1</div>
                                    <div>• <strong>Default output format:</strong> json, yaml, text, table</div>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-yellow-900/30 border border-yellow-700/50">
                                <div className="text-sm font-medium description !text-yellow-400 mb-2">⚠️ AWS Console User Context:</div>
                                <div className="text-sm text-gray-300 font-quicksand space-y-2">
                                    <div>• When logging in through <strong>AWS Console</strong>, the user defaults to <code className="text-green-400">ssm-user</code></div>
                                    <div>• When <strong>CRON jobs</strong> run through schedule, they run as <code className="text-green-400">ec2-user</code> automatically</div>
                                    <div>• <strong>Before running commands</strong>, execute:</div>
                                    <div className="ml-4 mt-2">
                                        <CodeSnippet code="sudo su -l ec2-user" language="bash" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'ec2' && (
                    <>
                        <h4 className="text-lg font-quicksand font-medium mb-2">EC2 Instance Management</h4>
                        <div className="text-sm description mb-3">Common EC2 commands for instance management</div>
                        <div className="flex space-x-2 overflow-x-auto p-1.5 tab-bg rounded-lg mb-4 shadow-sm dark:shadow-none">
                            {ec2Options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setActiveEc2Option(option.id)}
                                    className={`px-4 py-2 text-sm whitespace-nowrap font-medium rounded-md transition-colors ${
                                        activeEc2Option === option.id
                                            ? 'bg-blue-600 text-white !cursor-default shadow-md'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        {renderEc2Inputs()}
                        <div className="mt-4">
                            <div className="text-sm font-medium description !text-blue-400 mb-2">{ec2Options.find(o => o.id === activeEc2Option)?.label}</div>
                            <div className="text-xs description text-gray-400 mb-2">{getEc2Description()}</div>
                            <CodeSnippet code={getEc2Command()} language="bash" />
                        </div>
                    </>
                )}

                {activeTab === 's3' && (
                    <>
                        <h4 className="text-lg font-quicksand font-medium mb-2">S3 Bucket Operations</h4>
                        <div className="text-sm description mb-3">Common S3 commands for bucket and object management</div>
                        <div className="flex space-x-2 overflow-x-auto p-1.5 tab-bg rounded-lg mb-4 shadow-sm dark:shadow-none">
                            {s3Options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setActiveS3Option(option.id)}
                                    className={`px-4 py-2 text-sm whitespace-nowrap  font-medium rounded-md transition-colors ${
                                        activeS3Option === option.id
                                            ? 'bg-blue-600 text-white !cursor-default shadow-md'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        {renderS3Inputs()}
                        <div className="mt-4">
                            <div className="text-sm font-medium description !text-blue-400 mb-2">{s3Options.find(o => o.id === activeS3Option)?.label}</div>
                            <div className="text-xs description text-gray-400 mb-2">{getS3Description()}</div>
                            <CodeSnippet code={getS3Command()} language="bash" />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
