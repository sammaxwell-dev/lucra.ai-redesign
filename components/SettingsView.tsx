import React, { useState } from 'react';
import { User, Bell, Shield, Globe, Moon, Monitor, Camera, ChevronRight, LogOut, Mail, Lock } from 'lucide-react';
import { Button } from './ui/button';

const SettingsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'security'>('profile');

    return (
        <main className="flex-1 h-screen md:h-[95vh] my-0 md:my-auto mx-0 md:mx-4 bg-white rounded-none md:rounded-[2rem] shadow-sm border-0 md:border border-slate-100 overflow-hidden relative flex flex-col">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 pattern-dots opacity-30 pointer-events-none" />

            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 flex">

                {/* Settings Sidebar */}
                <div className="w-64 border-r border-slate-100 p-6 hidden md:block">
                    <h2 className="text-xl font-display font-bold mb-6">
                        <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                            Settings
                        </span>
                    </h2>
                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                        >
                            <User size={18} />
                            <span>Profile</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('appearance')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'appearance' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                        >
                            <Monitor size={18} />
                            <span>Appearance</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'notifications' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                        >
                            <Bell size={18} />
                            <span>Notifications</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                        >
                            <Shield size={18} />
                            <span>Security</span>
                        </button>
                    </nav>
                </div>

                {/* Settings Content */}
                <div className="flex-1 p-6 md:p-10 max-w-4xl">
                    <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-2">
                        <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </span>
                    </h1>
                    <p className="text-slate-500 mb-8">Manage your account settings and preferences.</p>

                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                            {/* Avatar Section */}
                            <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 relative overflow-hidden group">
                                        {/* Placeholder for avatar */}
                                        <User size={32} />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <Camera size={20} className="text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                                                Your Avatar
                                            </span>
                                        </h3>
                                        <p className="text-sm text-slate-500">Click on the image to upload a new one.</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="hidden sm:flex">Remove</Button>
                            </section>

                            <section className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                                        <input type="text" defaultValue="David Whitewolf" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white text-slate-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input type="email" defaultValue="david@lucra.ai" className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white text-slate-800" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Role</label>
                                        <input type="text" defaultValue="Design Lead" readOnly className="w-full px-4 py-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 cursor-not-allowed" />
                                    </div>
                                </div>
                            </section>

                            <div className="pt-6 border-t border-slate-100 flex justify-end">
                                <Button className="bg-[#3D506D] hover:bg-[#2D3C52] text-white rounded-xl px-6">Save Changes</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                                        Theme Preference
                                    </span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button className="flex flex-col items-center p-4 border-2 border-slate-900 rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
                                        <div className="w-full h-24 rounded-xl bg-slate-100 border border-slate-200 mb-3 overflow-hidden relative">
                                            <div className="absolute top-0 left-0 right-0 h-4 bg-white border-b border-slate-200"></div>
                                            <div className="absolute top-6 left-2 w-16 h-2 bg-slate-200 rounded"></div>
                                        </div>
                                        <span className="font-medium text-slate-900">Light</span>
                                    </button>
                                    <button className="flex flex-col items-center p-4 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 transition-colors">
                                        <div className="w-full h-24 rounded-xl bg-slate-900 mb-3 overflow-hidden relative">
                                            <div className="absolute top-0 left-0 right-0 h-4 bg-slate-800 border-b border-slate-700"></div>
                                            <div className="absolute top-6 left-2 w-16 h-2 bg-slate-700 rounded"></div>
                                        </div>
                                        <span className="font-medium text-slate-600">Dark</span>
                                    </button>
                                    <button className="flex flex-col items-center p-4 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 transition-colors">
                                        <div className="w-full h-24 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 mb-3 overflow-hidden relative flex items-center justify-center">
                                            <Monitor size={24} className="text-slate-400" />
                                        </div>
                                        <span className="font-medium text-slate-600">System</span>
                                    </button>
                                </div>
                            </section>
                            <section className="space-y-4 pt-6 border-t border-slate-100">
                                <h3 className="text-lg font-semibold">
                                    <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                                        Language
                                    </span>
                                </h3>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center space-x-3">
                                        <Globe className="text-slate-500" size={20} />
                                        <div>
                                            <p className="font-medium">
                                                <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                                                    Display Language
                                                </span>
                                            </p>
                                            <p className="text-sm text-slate-500">English (United States)</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Change</Button>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                            {[
                                { title: 'Email Notifications', desc: 'Receive emails about your account activity.', id: 'email' },
                                { title: 'Push Notifications', desc: 'Receive push notifications on your device.', id: 'push' },
                                { title: 'Marketing Emails', desc: 'Receive emails about new features and offers.', id: 'marketing' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="pr-4">
                                        <h3 className="font-medium mb-1">
                                            <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                                                {item.title}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-slate-500">{item.desc}</p>
                                    </div>
                                    {/* Mock Toggle Switch */}
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={item.id !== 'marketing'} />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3D506D]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3D506D]"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                            <section className="space-y-6">
                                <h3 className="text-lg font-semibold">
                                    <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                                        Password & Authentication
                                    </span>
                                </h3>
                                <div className="space-y-4">
                                    <Button variant="outline" className="w-full justify-between h-auto py-3 px-4">
                                        <div className="flex items-center space-x-3">
                                            <Lock size={18} className="text-slate-500" />
                                            <div className="text-left">
                                                <p className="font-medium">
                                                    <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                                                        Change Password
                                                    </span>
                                                </p>
                                                <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-400" />
                                    </Button>
                                    <Button variant="outline" className="w-full justify-between h-auto py-3 px-4">
                                        <div className="flex items-center space-x-3">
                                            <Shield size={18} className="text-slate-500" />
                                            <div className="text-left">
                                                <p className="font-medium">
                                                    <span className="bg-gradient-to-r from-[#3D506D] via-[#4A5F7F] to-[#3D506D] bg-clip-text text-transparent">
                                                        Two-Factor Authentication
                                                    </span>
                                                </p>
                                                <p className="text-xs text-green-600">Enabled</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-400" />
                                    </Button>
                                </div>
                            </section>

                            <section className="pt-6 border-t border-slate-100">
                                <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-red-900">Sign out of all devices</h4>
                                        <p className="text-sm text-red-700">You will need to log in again on all devices.</p>
                                    </div>
                                    <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-100">
                                        <LogOut size={18} className="mr-2" />
                                        Sign Out
                                    </Button>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default SettingsView;
