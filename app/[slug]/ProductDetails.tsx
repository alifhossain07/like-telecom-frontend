import React from 'react';

const ProductDetails = () => {
  // This content represents exactly what your backend will send as an HTML string.
  // Content is extracted directly from the provided images.
  const staticHtmlContent = `
    <div class="cms-wrapper">
      <img src="/images/iphoneImage2.png" alt="iPhone 16" />
      
      <h3>iPhone 16 Price in Bangladesh</h3>
      <p>The latest iPhone 13 (Midnight | International | 128GB) price in Bangladesh is 63,999 BDT. You can buy the iPhone 13 at the lowest price from Sumsah Tech. Visit our website to buy the iPhone 13 and find more authentic and trusted products from the Apple brand.</p>

      <h3>iPhone 16 Specifications</h3>
      <p>To provide a clear understanding of what the iPhone 13 offers, here are its key specifications:</p>
      <ul>
        <li><strong>Display:</strong> 6.1-inch Super Retina XDR display</li>
        <li><strong>Processor:</strong> A15 Bionic chip with 6-core CPU</li>
        <li><strong>Camera:</strong> Dual 12MP camera system (Ultra Wide and Wide) with Night mode, 4K Dolby Vision HDR recording</li>
        <li><strong>Front Camera:</strong> 12MP TrueDepth camera with Night mode</li>
        <li><strong>Battery Life:</strong> Up to 19 hours of video playback</li>
        <li><strong>Battery:</strong> 3240 mAh (approximately)</li>
        <li><strong>Storage Options:</strong> 128GB, 256GB, 512GB</li>
        <li><strong>Operating System:</strong> iOS 15, upgradable to the latest version</li>
        <li><strong>5G Capable:</strong> Yes, with support for multiple 5G bands</li>
        <li><strong>Water Resistance:</strong> IP68 rating (up to 6 meters for 30 minutes)</li>
      </ul>
      <p>These impressive features make the iPhone 13 a powerful device for everyday use, whether you need it for professional tasks, photography, or entertainment.</p>

      <h3>iPhone 16 Price Camera Capabilities</h3>
      <p>The iPhone 13 camera system is another highlight, featuring a dual 12MP setup. The Ultra Wide and Wide cameras ensure that you capture every moment in stunning detail. With features like Night mode, 4K Dolby Vision HDR recording, and deep integration with Apple's A15 Bionic chip, the iPhone 13 delivers professional-quality photos and videos.</p>
      
      <img src="/images/likeTeam.png" alt="Like Telecom Store" />

      <h3>Buy Apple 40W Dynamic Power Adapter in Bangladesh - Best Apple Products at Like Telecom.</h3>
      <p>Like Telecom is the most trusted online shop in Bangladesh for buying smartphones, laptops, and smart electronics products. Buy the Apple 40W Dynamic Power Adapter at the lowest price from our Like Telecom website or visit any of our showrooms. We offer the best authentic products with no hidden charges and the lowest Apple Smartphone price in Bangladesh. The Apple 40W Dynamic Power Adapter is the best quality product now in Bangladesh.</p>

      <div class="review-highlight">
        <h3>Watch the Latest Review of iPhone 16</h3>
        <p>Like Telecom is the best place for smartphones in Bangladesh and top iPhone shop in Bangladesh, we have a lot of collection of accessories and gadest of with many reputed brand. We have knowledgeable tech specialists and experts, so we can provide trusted insights and reviews on the latest gadgets. Our specialists thoroughly reviewed the iPhone 15 Pro Max in Bangladesh and gave it an outstanding overall rating of <strong>91 out of 100</strong>.</p>
      </div>
    </div>
  `;

  return (
    <div className="w-full mx-auto py-2 ">
      {/* We use dangerouslySetInnerHTML to render the raw HTML from the "backend".
        The CSS below will target the tags inside this div without needing specific classes.
      */}
      <article 
        className="dynamic-content-renderer"
        dangerouslySetInnerHTML={{ __html: staticHtmlContent }} 
      />
    </div>
  );
};

export default ProductDetails;