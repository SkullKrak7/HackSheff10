import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface AgentMessage {
  agent: string;
  message: string;
  timestamp: string;
}

const GuidedMode: React.FC = () => {
  const [step, setStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    event: '',
    presentation: '',
    mood: '',
    weather: '',
    budget: '',
    colorPreference: ''
  });
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setStep(2);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    setAgentMessages([]);
    setStep(3);

    try {
      // Step 1: Vision Agent analyzes wardrobe (only if image uploaded)
      if (uploadedImage) {
        const visionResponse = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Analyze this wardrobe image in detail',
            image_url: uploadedImage
          })
        });
        const visionData = await visionResponse.json();
        const visionAgents = visionData.responses.filter((r: any) => r.agent === 'VisionAgent');
        setAgentMessages(prev => [...prev, ...visionAgents]);
        await new Promise(r => setTimeout(r, 1000));
      }

      // Step 2: Get recommendations based on preferences
      const recMessage = `Recommend an outfit for: ${formData.event}. I want to look ${formData.presentation}, feeling ${formData.mood}, weather is ${formData.weather}, budget ${formData.budget}, prefer colors that ${formData.colorPreference}.`;
      
      const recResponse = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: recMessage })
      });
      const recData = await recResponse.json();
      const recAgents = recData.responses.filter((r: any) => r.agent === 'RecommendationAgent');
      setAgentMessages(prev => [...prev, ...recAgents]);
      await new Promise(r => setTimeout(r, 1000));

      // Step 3: Generate image
      const imgMessage = 'Generate a visual image of this recommended outfit';
      const imgResponse = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: imgMessage })
      });
      const imgData = await imgResponse.json();
      
      const imageAgent = imgData.responses.find((r: any) => r.agent === 'ImageGenAgent');
      if (imageAgent?.image_base64) {
        setGeneratedImage(imageAgent.image_base64);
      }
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getAgentColor = (agent: string) => {
    if (agent === 'VisionAgent') return 'bg-purple-100 text-purple-900';
    if (agent === 'RecommendationAgent') return 'bg-green-100 text-green-900';
    if (agent === 'ConversationAgent') return 'bg-yellow-100 text-yellow-900';
    return 'bg-gray-100 text-gray-900';
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Wardrobe</h2>
          <p className="text-gray-600 mb-6">Start by uploading a photo of clothing you're considering</p>
          
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition">
            <div className="flex flex-col items-center">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg text-gray-600">Click to upload image</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Tell Us About Your Event</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">What is the event?</label>
              <input
                type="text"
                value={formData.event}
                onChange={(e) => setFormData({...formData, event: e.target.value})}
                placeholder="e.g., wedding, party, date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">How do you want to be perceived?</label>
              <input
                type="text"
                value={formData.presentation}
                onChange={(e) => setFormData({...formData, presentation: e.target.value})}
                placeholder="e.g., elegant, casual, professional"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Mood</label>
              <input
                type="text"
                value={formData.mood}
                onChange={(e) => setFormData({...formData, mood: e.target.value})}
                placeholder="e.g., confident, relaxed"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Weather</label>
              <input
                type="text"
                value={formData.weather}
                onChange={(e) => setFormData({...formData, weather: e.target.value})}
                placeholder="e.g., sunny, rainy, cold"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Budget</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select budget</option>
                <option value="Low (Under £50)">Low (Under £50)</option>
                <option value="Medium (£50-£150)">Medium (£50-£150)</option>
                <option value="High (£150+)">High (£150+)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Color Preferences</label>
              <input
                type="text"
                value={formData.colorPreference}
                onChange={(e) => setFormData({...formData, colorPreference: e.target.value})}
                placeholder="e.g., match my skintone, bold colors"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-8 w-full py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-lg"
          >
            Get AI Recommendations
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">AI Agents Collaborating</h2>
            
            <div className="space-y-4">
              {agentMessages.map((msg, idx) => (
                <div key={idx} className={`p-4 rounded-xl ${getAgentColor(msg.agent)}`}>
                  <div className="font-semibold mb-2">{msg.agent}</div>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{msg.message}</ReactMarkdown>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {generatedImage && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Outfit Visualization</h3>
              <img 
                src={`data:image/jpeg;base64,${generatedImage}`} 
                alt="Generated outfit" 
                className="w-full max-w-md mx-auto rounded-xl shadow-lg"
              />
            </div>
          )}

          <button
            onClick={() => {
              setStep(1);
              setUploadedImage(null);
              setAgentMessages([]);
              setGeneratedImage(null);
              setFormData({
                event: '',
                presentation: '',
                mood: '',
                weather: '',
                budget: '',
                colorPreference: ''
              });
            }}
            className="w-full py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default GuidedMode;
