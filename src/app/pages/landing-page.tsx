import { useState, useEffect } from 'react';
import { Hero } from '../components/hero';
import { SignupForm } from '../components/signup-form';
import { ContentSections } from '../components/content-sections';
import { SocialShare } from '../components/social-share';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';
import headerImage from 'figma:asset/5b55fdc032c6621c5e06f8a25920c20d09140022.png';
import journeyImage from 'figma:asset/e59fc3923399bc5e4d8837acc2de1bbe11d09fc1.png';
import creditsImage from 'figma:asset/67301e339a8050a33621372e1e51ba3e8b0852fa.png';
import type { LandingPageConfig } from '../components/admin/landing-page-editor';
import { textStyleToCSS } from '../components/admin/landing-page-editor';
import { useCustomFonts } from '../components/use-custom-fonts';

export type UserType = 'filmmaker' | 'parent' | 'educator' | 'teen' | 'investor' | 'donor' | 'just-curious' | null;

export function LandingPage() {
  const [userType, setUserType] = useState<UserType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [landingConfig, setLandingConfig] = useState<LandingPageConfig | null>(null);
  // Load custom fonts so @font-face rules are injected for visitor-facing pages
  useCustomFonts();

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

  const handleSubscribe = async (email: string, name: string, selectedType: UserType) => {
    if (!selectedType) {
      toast.error("Please select who you are!");
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
            userType: selectedType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      toast.success(landingConfig?.signup?.successMessage || "\uD83C\uDF89 Welcome to The Frame Game!");
      setUserType(selectedType);
      
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

  const heroImgSrc = landingConfig?.hero?.headerImageUrl || headerImage;

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
          
          {/* Admin Link */}
          {(!landingConfig || landingConfig.showAdminLink !== false) && (
            <div className="mt-8">
              <a 
                href="/admin"
                className="hover:opacity-80 transition-opacity"
                style={adminLinkCSS}
              >
                Admin Login &rarr;
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