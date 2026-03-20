import { motion } from 'motion/react';
import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { LandingPageConfig } from './admin/landing-page-editor';
import { textStyleToCSS } from './admin/landing-page-editor';

interface SocialShareProps {
  config?: LandingPageConfig['social'] | null;
  textStyles?: LandingPageConfig['textStyles'] | null;
}

export function SocialShare({ config, textStyles }: SocialShareProps) {
  const shareUrl = window.location.origin;
  const shareText = config?.shareText || "Join me on The Frame Game - turning screen time into screen credits! \uD83C\uDFAC\u2728";

  const showTwitter = config?.showTwitter !== false;
  const showFacebook = config?.showFacebook !== false;
  const showLinkedIn = config?.showLinkedIn !== false;
  const showCopyLink = config?.showCopyLink !== false;

  const headingCSS = textStyles?.socialHeading
    ? textStyleToCSS(textStyles.socialHeading)
    : { fontFamily: 'Comic Neue, cursive', color: '#ffffff' };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="mt-8 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Share2 className="w-5 h-5" style={{ color: headingCSS.color }} />
        <p style={headingCSS}>
          Share with friends!
        </p>
      </div>
      
      <div className="flex gap-3 justify-center">
        {showTwitter && (
          <motion.button
            onClick={handleTwitterShare}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Share on Twitter"
          >
            <Twitter className="w-6 h-6 text-white" />
          </motion.button>
        )}

        {showFacebook && (
          <motion.button
            onClick={handleFacebookShare}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Share on Facebook"
          >
            <Facebook className="w-6 h-6 text-white" />
          </motion.button>
        )}

        {showLinkedIn && (
          <motion.button
            onClick={handleLinkedInShare}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-6 h-6 text-white" />
          </motion.button>
        )}

        {showCopyLink && (
          <motion.button
            onClick={handleCopyLink}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Copy link"
          >
            <LinkIcon className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
