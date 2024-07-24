import { Check, Clipboard } from 'lucide-react';
import React, { useState } from 'react';

const CopyToClipboard = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const value = parseFloat(text.toFixed(2))

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setIsCopied(true);

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div>
      <button onClick={copyToClipboard} className='text-zinc-400'>
        {isCopied ? <Check className='text-green-400'/> : <Clipboard width={18} className='text-zinc-400'/>}
      </button>
    </div>
  );
};

export default CopyToClipboard;
