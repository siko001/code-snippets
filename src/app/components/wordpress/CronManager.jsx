'use client';

import { useState, useEffect } from 'react';
import CodeSnippet from '../CodeSnippet';

export default function CronManager() {
    const [cronEvents, setCronEvents] = useState([]);
    const [schedules, setSchedules] = useState([
        'hourly',
        'twicedaily',
        'daily',
        'weekly',
        'monthly'
    ]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [newCron, setNewCron] = useState({
        hook_name: '',
        schedule: 'daily',
        args: []
    });
    const [output, setOutput] = useState('wp cron event list');
    const [runArgs, setRunArgs] = useState('');
    const [newCronArgs, setNewCronArgs] = useState('');
    const [view, setView] = useState('run'); // 'run', 'schedule', 'list'
    const [runHook, setRunHook] = useState('');
    
    const resetForm = () => {
        // Reset all form fields
        setView('run');
        setRunHook('');
        setRunArgs('');
        setNewCron({
            hook_name: '',
            schedule: 'daily',
            args: []
        });
        setNewCronArgs('');
        // Set output to default command
        setOutput('wp cron event list');
    };

    const listCronEvents = () => {
        return 'wp cron event list --format=json';
    };

    const runCronEvent = (hook, args) => {
        const argsStr = args ? ` --args='${JSON.stringify([args])}'` : '';
        return `wp cron event run "${hook}"${argsStr}`;
    };

    const deleteCronEvent = (hook, args = []) => {
        const argsStr = args.length ? ` --args='${JSON.stringify(args)}'` : '';
        return `wp cron event delete "${hook}"${argsStr}`;
    };

    const scheduleCronEvent = (hook, schedule, args) => {
        const argsStr = args ? ` --args='${JSON.stringify([args])}'` : '';
        return `wp cron event schedule "${hook}" "${schedule}"${argsStr}`;
    };

    const listSchedules = () => {
        return 'wp cron schedule list --format=json';
    };

    const handleRunEvent = (hook, args = []) => {
        setOutput(runCronEvent(hook, args));
    };

    const handleDeleteEvent = (hook, args = []) => {
        setOutput(deleteCronEvent(hook, args));
    };

    const handleScheduleEvent = () => {
        if (!newCron.hook_name) return;
        setOutput(scheduleCronEvent(
            newCron.hook_name,
            newCron.schedule,
            newCronArgs
        ));
        // Reset form
        setNewCron({
            hook_name: '',
            schedule: 'daily',
            args: []
        });
        setNewCronArgs('');
    };

    const loadCronEvents = () => {
        // In a real app, you would fetch this from your API
        // For now, we'll just set some example data
        setCronEvents([
            {
                hook: 'wp_version_check',
                next_run: new Date(Date.now() + 3600000).toISOString(),
                schedule: 'twicedaily',
                args: []
            },
            {
                hook: 'wp_update_plugins',
                next_run: new Date(Date.now() + 7200000).toISOString(),
                schedule: 'twicedaily',
                args: []
            },
            {
                hook: 'wp_update_themes',
                next_run: new Date(Date.now() + 10800000).toISOString(),
                schedule: 'twicedaily',
                args: []
            }
        ]);
    };

    useEffect(() => {
        loadCronEvents();
        // Set default output on initial load
        setOutput('wp cron event list');
    }, []);

    // Update output when run hook or args change
    useEffect(() => {
        if (view === 'run') {
            if (runHook) {
                setOutput(runCronEvent(runHook, runArgs));
            } else {
                setOutput('wp cron event list');
            }
        }
    }, [runHook, runArgs, view, runCronEvent]);

    // Update output when new cron details change
    useEffect(() => {
        if (view === 'schedule') {
            if (newCron.hook_name) {
                setOutput(scheduleCronEvent(
                    newCron.hook_name,
                    newCron.schedule,
                    newCronArgs
                ));
            } else {
                setOutput('wp cron event list');
            }
        }
    }, [newCron, view, scheduleCronEvent, newCronArgs]);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 id="wp-cron-manager"  className="text-xl font-semibold text-blue-400 mb-4">
                    Cron Manager
                </h3>
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1 bg-gray-700 p-1 rounded-md">
                        <button
                            onClick={() => setView('run')}
                            className={`px-3 py-1 text-sm rounded ${view === 'run' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                        >
                            Run
                        </button>
                        <button
                            onClick={() => setView('schedule')}
                            className={`px-3 py-1 text-sm rounded ${view === 'schedule' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                        >
                            Schedule
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-3 py-1 text-sm rounded ${view === 'list' ? 'bg-gray-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                        >
                            List
                        </button>
                    </div>
                    <button
                        onClick={resetForm}
                        className="px-3 py-1 cursor-pointer text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* List Cron Events */}
                <div className={view !== 'list' ? 'hidden' : ''}>
                    <h4 className="text-lg font-medium text-gray-300 mb-2">Scheduled Cron Events</h4>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hook</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Next Run</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Schedule</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {cronEvents.map((event, index) => (
                                    <tr key={index} className="hover:bg-gray-700">
                                        <td className="px-4 py-2 text-sm text-gray-300">
                                            <span className="font-mono">{event.hook}</span>
                                            {event.args && event.args.length > 0 && (
                                                <span className="text-xs text-gray-400 ml-2">
                                                    {JSON.stringify(event.args)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-300">
                                            {new Date(event.next_run).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-300">
                                            {event.schedule}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-300 space-x-2">
                                            <button
                                                onClick={() => handleRunEvent(event.hook, event.args)}
                                                className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                                            >
                                                Run Now
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvent(event.hook, event.args)}
                                                className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Run Cron Event */}
                <div className={`bg-gray-900 rounded-lg p-4 ${view !== 'run' ? 'hidden' : ''}`}>
                    <h4 className="text-lg font-medium text-gray-300 mb-4">Run Cron Event</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Hook Name
                            </label>
                            <input
                                type="text"
                                value={runHook}
                                onChange={(e) => setRunHook(e.target.value)}
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                placeholder="my_custom_hook"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Arguments (optional)
                            </label>
                            <input
                                type="text"
                                value={runArgs}
                                onChange={(e) => setRunArgs(e.target.value)}
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                placeholder="Enter arguments"
                            />
                        </div>
                    </div>
                </div>

                {/* Schedule New Cron Event */}
                <div className={`bg-gray-900 rounded-lg p-4 ${view !== 'schedule' ? 'hidden' : ''}`}>
                    <h4 className="text-lg font-medium text-gray-300 mb-4">Schedule New Cron Event</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Hook Name
                            </label>
                            <input
                                type="text"
                                value={newCron.hook_name}
                                onChange={(e) => setNewCron({...newCron, hook_name: e.target.value})}
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                placeholder="my_custom_hook"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Schedule
                            </label>
                            <select
                                value={newCron.schedule}
                                onChange={(e) => setNewCron({...newCron, schedule: e.target.value})}
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                            >
                                {schedules.map((schedule) => (
                                    <option key={schedule} value={schedule}>
                                        {schedule}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Arguments (optional)
                            </label>
                            <input
                                type="text"
                                value={newCronArgs}
                                onChange={(e) => setNewCronArgs(e.target.value)}
                                className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                                placeholder="Enter arguments"
                            />
                        </div>
                    </div>
                </div>

                {/* Generated Command */}
                {output && (
                    <div className="mt-6">
                        <h4 className="text-lg font-medium text-gray-300 mb-2">Generated Command</h4>
                        <CodeSnippet code={output} language="bash" />
                    </div>
                )}
            </div>
        </div>
    );
}
