import React from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';

const PostCode = () => {
  const handleComplete = (data: any) => {
    console.log(data);
  }

  return (
    <DaumPostcodeEmbed onComplete={handleComplete} />
  );
};

export default PostCode;
