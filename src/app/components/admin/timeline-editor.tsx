import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Milestone {
  date: string;
  event: string;
  description: string;
}

interface Timeline {
  userType: 'beta-tester' | 'donor' | 'investor';
  title: string;
  milestones: Milestone[];
}

export function TimelineEditor() {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState<'beta-tester' | 'donor' | 'investor'>('beta-tester');

  useEffect(() => {
    fetchTimelines();
  }, []);

  const fetchTimelines = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/timelines`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch timelines');
      }

      const data = await response.json();
      
      // Ensure all user types have a timeline
      const allTimelines: Timeline[] = [
        {
          userType: 'beta-tester',
          title: 'Beta Launch Timeline',
          milestones: data.timelines.find((t: Timeline) => t.userType === 'beta-tester')?.milestones || [
            { date: 'Spring 2026', event: 'Beta Testing Begins', description: 'First wave of testers get access' }
          ]
        },
        {
          userType: 'donor',
          title: 'Donor Impact Timeline',
          milestones: data.timelines.find((t: Timeline) => t.userType === 'donor')?.milestones || [
            { date: 'Q2 2026', event: 'Donation Campaign Launch', description: 'Start accepting contributions' }
          ]
        },
        {
          userType: 'investor',
          title: 'Investment Roadmap',
          milestones: data.timelines.find((t: Timeline) => t.userType === 'investor')?.milestones || [
            { date: 'Q2 2026', event: 'Seed Round', description: 'Opening seed investment round' }
          ]
        }
      ];

      setTimelines(allTimelines);
    } catch (error) {
      console.error('Error fetching timelines:', error);
      toast.error('Failed to load timelines');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (timeline: Timeline) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/admin/timelines`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(timeline),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save timeline');
      }

      toast.success('Timeline saved successfully!');
      fetchTimelines();
    } catch (error) {
      console.error('Error saving timeline:', error);
      toast.error('Failed to save timeline');
    } finally {
      setIsSaving(false);
    }
  };

  const currentTimeline = timelines.find(t => t.userType === activeTimeline);

  const handleUpdateTitle = (title: string) => {
    setTimelines(prev => 
      prev.map(t => 
        t.userType === activeTimeline 
          ? { ...t, title }
          : t
      )
    );
  };

  const handleAddMilestone = () => {
    setTimelines(prev => 
      prev.map(t => 
        t.userType === activeTimeline 
          ? { 
              ...t, 
              milestones: [
                ...t.milestones, 
                { date: '', event: '', description: '' }
              ]
            }
          : t
      )
    );
  };

  const handleUpdateMilestone = (index: number, field: keyof Milestone, value: string) => {
    setTimelines(prev => 
      prev.map(t => 
        t.userType === activeTimeline 
          ? {
              ...t,
              milestones: t.milestones.map((m, i) => 
                i === index ? { ...m, [field]: value } : m
              )
            }
          : t
      )
    );
  };

  const handleDeleteMilestone = (index: number) => {
    setTimelines(prev => 
      prev.map(t => 
        t.userType === activeTimeline 
          ? {
              ...t,
              milestones: t.milestones.filter((_, i) => i !== index)
            }
          : t
      )
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
        <p className="mt-4 text-gray-600" style={{ fontFamily: 'Comic Neue, cursive' }}>
          Loading timelines...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline Selector */}
      <div className="bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex gap-3">
          <TimelineButton
            active={activeTimeline === 'beta-tester'}
            onClick={() => setActiveTimeline('beta-tester')}
            label="Beta Tester"
            color="yellow"
          />
          <TimelineButton
            active={activeTimeline === 'donor'}
            onClick={() => setActiveTimeline('donor')}
            label="Donor"
            color="pink"
          />
          <TimelineButton
            active={activeTimeline === 'investor'}
            onClick={() => setActiveTimeline('investor')}
            label="Investor"
            color="green"
          />
        </div>
      </div>

      {/* Editor */}
      {currentTimeline && (
        <motion.div
          key={activeTimeline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8"
        >
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                Timeline Title
              </label>
              <input
                type="text"
                value={currentTimeline.title}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-400 text-lg"
                style={{ fontFamily: 'Comic Neue, cursive' }}
                placeholder="Timeline title"
              />
            </div>

            {/* Milestones */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-lg font-bold text-gray-800" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  Milestones
                </label>
                <motion.button
                  onClick={handleAddMilestone}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 font-semibold"
                  style={{ fontFamily: 'Comic Neue, cursive' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  Add Milestone
                </motion.button>
              </div>

              <div className="space-y-4">
                {currentTimeline.milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 border-2 border-gray-200 rounded-2xl bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-700" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                        Milestone {index + 1}
                      </h4>
                      <motion.button
                        onClick={() => handleDeleteMilestone(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
                          Date
                        </label>
                        <input
                          type="text"
                          value={milestone.date}
                          onChange={(e) => handleUpdateMilestone(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                          style={{ fontFamily: 'Comic Neue, cursive' }}
                          placeholder="e.g., Spring 2026"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
                          Event
                        </label>
                        <input
                          type="text"
                          value={milestone.event}
                          onChange={(e) => handleUpdateMilestone(index, 'event', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                          style={{ fontFamily: 'Comic Neue, cursive' }}
                          placeholder="Event name"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-1" style={{ fontFamily: 'Comic Neue, cursive' }}>
                        Description
                      </label>
                      <textarea
                        value={milestone.description}
                        onChange={(e) => handleUpdateMilestone(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                        style={{ fontFamily: 'Comic Neue, cursive' }}
                        placeholder="Brief description"
                      />
                    </div>
                  </motion.div>
                ))}

                {currentTimeline.milestones.length === 0 && (
                  <div className="text-center py-8 text-gray-500" style={{ fontFamily: 'Comic Neue, cursive' }}>
                    No milestones yet. Click "Add Milestone" to get started!
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              onClick={() => handleSave(currentTimeline)}
              disabled={isSaving}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
              whileHover={!isSaving ? { scale: 1.02 } : {}}
              whileTap={!isSaving ? { scale: 0.98 } : {}}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  Save Timeline
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function TimelineButton({ active, onClick, label, color }: { 
  active: boolean; 
  onClick: () => void; 
  label: string; 
  color: string;
}) {
  const colorClasses = {
    yellow: active ? 'from-yellow-400 to-orange-500' : 'bg-yellow-100 text-yellow-700',
    pink: active ? 'from-pink-500 to-red-500' : 'bg-pink-100 text-pink-700',
    green: active ? 'from-green-400 to-cyan-500' : 'bg-green-100 text-green-700',
  }[color];

  return (
    <motion.button
      onClick={onClick}
      className={`flex-1 px-6 py-3 rounded-2xl font-bold transition-all ${
        active
          ? `bg-gradient-to-r ${colorClasses} text-white shadow-lg`
          : `${colorClasses} hover:opacity-80`
      }`}
      style={{ fontFamily: 'Fredoka, sans-serif' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  );
}
