// Bubble state
let bubble = null;
let isVisible = false;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleBubble") {
    toggleBubble();
    sendResponse({ success: true });
  }
  return true;
});

/**
 * Toggle the bubble visibility
 */
function toggleBubble() {
  if (isVisible && bubble) {
    hideBubble();
  } else {
    showBubble();
  }
}

/**
 * Show the bubble
 */
function showBubble() {
  if (!bubble) {
    createBubble();
  }
  
  const datePosted = findJobPostDate();
  updateBubbleContent(datePosted);
  
  bubble.style.display = 'block';
  // Trigger animation
  requestAnimationFrame(() => {
    bubble.style.opacity = '1';
    bubble.style.transform = 'translateY(0)';
  });
  
  isVisible = true;
  
  // Add click outside listener
  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 100);
}

/**
 * Hide the bubble
 */
function hideBubble() {
  if (bubble) {
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      bubble.style.display = 'none';
    }, 200);
  }
  isVisible = false;
  document.removeEventListener('click', handleOutsideClick);
}

/**
 * Handle clicks outside the bubble
 */
function handleOutsideClick(event) {
  if (bubble && !bubble.contains(event.target)) {
    hideBubble();
  }
}

/**
 * Create the bubble element
 */
function createBubble() {
  bubble = document.createElement('div');
  bubble.id = 'job-post-date-bubble';
  
  // Inject styles
  const styles = document.createElement('style');
  styles.textContent = `
    #job-post-date-bubble {
      position: fixed;
      top: 5px;
      right: 60px;
      z-index: 2147483647;
      background: white;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      min-width: 220px;
      max-width: 300px;
      display: none;
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    
    #job-post-date-bubble * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    #job-post-date-bubble .jpd-content {
      text-align: center;
    }
    
    #job-post-date-bubble .jpd-date-main {
      font-size: 16px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 10px;
      line-height: 1.4;
    }
    
    #job-post-date-bubble .jpd-date-relative {
      font-size: 14px;
      color: #667eea;
      font-weight: 500;
      padding: 6px 14px;
      background: #f0f4ff;
      border-radius: 20px;
      display: inline-block;
    }
    
    #job-post-date-bubble .jpd-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }
    
    #job-post-date-bubble .jpd-message {
      font-size: 16px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 6px;
    }
    
    #job-post-date-bubble .jpd-submessage {
      font-size: 13px;
      color: #718096;
      line-height: 1.4;
    }
    
    #job-post-date-bubble .jpd-error .jpd-message {
      color: #e53e3e;
    }
  `;
  
  document.head.appendChild(styles);
  document.body.appendChild(bubble);
}

/**
 * Update the bubble content based on the date found
 */
function updateBubbleContent(dateString) {
  if (!bubble) return;
  
  if (dateString) {
    const date = new Date(dateString);
    
    // Format the date nicely
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    
    // Calculate days ago
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let daysAgoText = '';
    if (diffDays === 0) {
      daysAgoText = 'Today';
    } else if (diffDays === 1) {
      daysAgoText = 'Yesterday';
    } else if (diffDays > 1) {
      daysAgoText = `${diffDays} days ago`;
    }
    
    bubble.innerHTML = `
      <div class="jpd-content">
        <div class="jpd-date-main">Posted on ${formattedDate}</div>
        ${daysAgoText ? `<div class="jpd-date-relative">${daysAgoText}</div>` : ''}
      </div>
    `;
  } else {
    bubble.innerHTML = `
      <div class="jpd-content">
        <div class="jpd-icon">🔍</div>
        <div class="jpd-message">No date found</div>
        <div class="jpd-submessage">This page doesn't have job posting date info</div>
      </div>
    `;
  }
}

/**
 * Searches the page for JSON-LD structured data containing JobPosting
 * and extracts the datePosted field
 */
function findJobPostDate() {
  // Find all script tags with type="application/ld+json"
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  
  for (let script of scripts) {
    try {
      const data = JSON.parse(script.textContent);
      
      // Check if this is a JobPosting schema
      if (data['@type'] === 'JobPosting' && data.datePosted) {
        return data.datePosted;
      }
      
      // Sometimes data can be in an array or nested
      if (Array.isArray(data)) {
        for (let item of data) {
          if (item['@type'] === 'JobPosting' && item.datePosted) {
            return item.datePosted;
          }
        }
      }
      
      // Check if it's wrapped in @graph (some sites use this)
      if (data['@graph'] && Array.isArray(data['@graph'])) {
        for (let item of data['@graph']) {
          if (item['@type'] === 'JobPosting' && item.datePosted) {
            return item.datePosted;
          }
        }
      }
    } catch (e) {
      // Invalid JSON, skip this script tag
      continue;
    }
  }
  
  return null; // No date found
}
