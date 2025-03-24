import { DynamicIcon, IconName } from 'lucide-react/dynamic';

function SocialFooter({ links }: { links: {[key: string]: string} }) {
  return (
    <div className="flex flex-row gap-4">
      {Object.entries(links).map(([key, value]) => (
        <a href={value} key={key}>
          <DynamicIcon name={key as IconName} />
        </a>
      ))}
    </div>
  );
}
const socialLinks = {
  twitter: 'https://x.carlosnexans.com',
  github: 'https://github.carlosnexans.com',
  linkedin: 'https://linkedin.carlosnexans.com',
  youtube: 'https://youtube.carlosnexans.com',
};

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center gap-4 py-4">
      <SocialFooter links={socialLinks} />
      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Carlos Nexans. All rights reserved.
      </p>
    </footer>
  );
}