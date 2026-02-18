import { Metadata } from 'next';
import YahtzeeApp from './YahtzeeApp';

export const metadata: Metadata = {
  title: 'Yahtzee Tracker | Overly Serious Leisure',
  description: 'Track Yahtzee games, analyze player performance, and discover statistics.',
};

export default function YahtzeePage() {
  return <YahtzeeApp />;
}
