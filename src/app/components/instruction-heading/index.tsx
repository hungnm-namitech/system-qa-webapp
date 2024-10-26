import React from 'react';
import { Step } from '@/app/types/manual';

type UrlTextProps = {
  step: Step;
};

function convertUrlsToLinks(description: string, metadataTarget?: string): string {
  const urlRegex =
    /((https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[a-zA-Z0-9._~:/?#\[\]@!$&'()*+,;=%-]*)?)/g;
  return description.replace(urlRegex, (url) => {
    const hyperlink =
      metadataTarget ||
      (url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`);
    return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer" class="underline text-blue-600">${url}</a>`;
  });
}

const InstructionHeading: React.FC<UrlTextProps> = ({ step }) => {
  const { description, metadata } = step;

  const linkedDescription = convertUrlsToLinks(description, metadata?.target);

  return <span dangerouslySetInnerHTML={{ __html: linkedDescription }} />;
};

export default InstructionHeading;
