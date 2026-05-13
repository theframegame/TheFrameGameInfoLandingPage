import { useState, useEffect } from 'react';
import { ContentSections } from '../components/content-sections';
import { SocialShare } from '../components/social-share';
import { Hero } from '../components/hero';
import { SignupForm } from '../components/signup-form';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
const headerImage = 'https://images.unsplash.com/photo-1612539465474-77bd2cc10a10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbiUyMGNyZWF0aW5nJTIwZmlsbSUyMG1vdmllJTIwZWR1Y2F0aW9uJTIwZnVuJTIwY29sb3JmdWx8ZW58MXx8fHwxNzc4Njc5MzUyfDA&ixlib=rb-4.1.0&q=80&w=1080';
const journeyImage = 'https://images.unsplash.com/photo-1638893388548-2894f01b1836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwbGVhcm5pbmclMjBjcmVhdGl2aXR5JTIwdGVhbXdvcmslMjBlZHVjYXRpb24lMjBqb3VybmV5fGVufDF8fHx8MTc3ODY3OTM1Nnww&ixlib=rb-4.1.0&q=80&w=1080';
const creditsImage = 'https://images.unsplash.com/photo-1639465294781-d4d5d7319951?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2hpZXZlbWVudCUyMHN1Y2Nlc3MlMjByZXdhcmQlMjBzdGFycyUyMHRyb3BoeSUyMGNvbG9yZnVsfGVufDF8fHx8MTc3ODY3OTM1OXww&ixlib=rb-4.1.0&q=80&w=1080';
import type { LandingPageConfig } from '../components/admin/landing-page-editor';
import { textStyleToCSS } from '../components/admin/landing-page-editor';
import { useCustomFonts } from '../components/use-custom-fonts';

export type UserType = 'filmmaker' | 'parent' | 'educator' | 'student' | 'investor' | 'donor' | 'just-curious' | null;

export function LandingPage() {
  const { t, i18n } = useTranslation();
  const [userType, setUserType] = useState<UserType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [landingConfig, setLandingConfig] = useState<LandingPageConfig | null>(null);
  // Load custom fonts so @font-face rules are injected for visitor-facing pages
  useCustomFonts();

  // Check localStorage for existing user
  useEffect(() => {
    const existingUserData = localStorage.getItem('frameGameUser');
    if (existingUserData) {
      try {
        const userData = JSON.parse(existingUserData);
        if (userData.userType) {
          setUserType(userData.userType);
        }
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
      }
    }
  }, []);

  useEffect(() => {
    fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/landing-config`,
      { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
    )
      .then(r => r.json())
      .then(data => {
        if (data.config) setLandingConfig(data.config);
      })
      .catch(err => console.error('Failed to load landing config:', err));
  }, []);

  const handleSubscribe = async (
    email: string, 
    name: string, 
    selectedTypes: UserType[], 
    country: string
  ) => {
    if (!selectedTypes || selectedTypes.length === 0) {
      toast.error(t('signup.selectType'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a8ba6828/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            name,
            userTypes: selectedTypes,
            country,
            language: i18n.language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      toast.success(landingConfig?.signup?.successMessage || t('signup.successMessage'));
      
      // Store user data in localStorage
      localStorage.setItem('frameGameUser', JSON.stringify({
        email,
        name,
        userType: selectedTypes[0], // Use first selected type for content display
        userTypes: selectedTypes,
        country,
        language: i18n.language,
      }));
      
      setUserType(selectedTypes[0]);
      
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build background style from config
  const bgStyle = landingConfig?.background
    ? { background: `linear-gradient(135deg, ${landingConfig.background.gradientFrom}, ${landingConfig.background.gradientVia}, ${landingConfig.background.gradientTo})` }
    : undefined;

  const heroImgSrc = landingConfig?.hero?.headerImageUrl && landingConfig.hero.headerImageUrl.trim() !== '' 
    ? landingConfig.hero.headerImageUrl 
    : headerImage;

  const ts = landingConfig?.textStyles;

  const adminLinkCSS = ts?.adminLink
    ? textStyleToCSS(ts.adminLink)
    : { fontFamily: 'Comic Neue, cursive', color: 'rgba(255,255,255,0.7)' };

  const footerCSS = ts?.footerText
    ? textStyleToCSS(ts.footerText)
    : { fontFamily: 'Comic Neue, cursive', color: 'rgba(255,255,255,0.6)' };

  return (
    <div
      className={!bgStyle ? "min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400" : "min-h-screen"}
      style={bgStyle}
    >
      {!userType ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <Hero
            headerImage={heroImgSrc}
            config={landingConfig?.hero}
            textStyles={landingConfig?.textStyles}
          />
          <SignupForm
            onSubscribe={handleSubscribe}
            isSubmitting={isSubmitting}
            config={landingConfig}
          />
          {(!landingConfig?.social || landingConfig.social.enabled !== false) && (
            <SocialShare
              config={landingConfig?.social}
              textStyles={landingConfig?.textStyles}
            />
          )}
          
          {/* Contact Button */}
          <div className="mt-8">
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-bold shadow-lg transition-all"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare className="w-5 h-5" />
              {t('common.contactLink')}
            </motion.a>
          </div>
          
          {/* Admin Link */}
          {(!landingConfig || landingConfig.showAdminLink !== false) && (
            <div className="mt-4">
              <a 
                href="/admin"
                className="hover:opacity-80 transition-opacity text-sm"
                style={adminLinkCSS}
              >
                {t('common.adminLink')} &rarr;
              </a>
            </div>
          )}

          {/* Footer Text */}
          {landingConfig?.footerText && (
            <p className="mt-4 text-center max-w-lg" style={footerCSS}>
              {landingConfig.footerText}
            </p>
          )}
        </div>
      ) : (
        <ContentSections 
          userType={userType} 
          journeyImage={journeyImage}
          creditsImage={creditsImage}
        />
      )}
    </div>
  );
}