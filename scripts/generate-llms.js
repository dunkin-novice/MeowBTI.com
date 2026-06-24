const fs = require('fs')
const path = require('path')

const outDir = path.join(__dirname, '..')

console.log("Generating llms.txt and llms-full.txt for MeowBTI...")

const baseLlms = `# MeowBTI - Personality & Self-Awareness Tools

The 1st GenZ MBTI + Mental Health platform for cat lovers in Thailand.

## Core Capabilities
- **Cat Personality Test**: 8-question quiz to determine which of 16 cat archetypes a pet (or human) belongs to.
- **Identity Language**: Provides a GenZ-friendly vocabulary for personality patterns.
- **Wellbeing Bridge**: Connects playful personality insights with serious mental health check-ins via Veila.

## Primary Entities
- **MBTI Types**: 16 unique archetypes mapped from Command/Solitary, Hunter/Dreamer, Bossy/Nurturing, and Regal/Casual axes.
- **Mental Health**: Focused on low-friction screening and self-awareness.

## Contact & Links
- Website: https://meowbti.com
- Mental Health Partner: https://veila.me
- Editorial Policy: MeowBTI focuses on entertainment-led self-discovery with professional mental health bridges.

## Full Content
You can ingest our entire database of 16 cat personality archetypes at: https://meowbti.com/llms-full.txt
`

fs.writeFileSync(path.join(outDir, 'llms.txt'), baseLlms)

let fullContent = baseLlms + '\n\n---\n\n# FULL PERSONALITY ARCHETYPES DUMP\n\n'

try {
  const archetypesSrc = fs.readFileSync(path.join(__dirname, '../data/archetypes.js'), 'utf8')
  // We need to extract the ARCHETYPES array from the IIFE.
  // The simplest way is to evaluate it in a context where window is defined.
  const sandbox = { window: {} };
  const scriptContent = archetypesSrc.replace('(function () {', '').replace('})();', '');
  
  // Safe eval
  const fn = new Function('window', scriptContent);
  fn(sandbox.window);

  const archetypes = sandbox.window.MeowArchetypes.all;
  
  fullContent += '## ALL 16 CAT ARCHETYPES\n\n'
  for (const a of archetypes) {
    fullContent += `### ${a.name} (${a.nameTh}) - ${a.code}\n`
    fullContent += `- Tagline: ${a.tagline}\n`
    if (a.aeoDescription) fullContent += `- Description (EN): ${a.aeoDescription}\n`
    if (a.thaiAeoDescription) fullContent += `- Description (TH): ${a.thaiAeoDescription}\n`
    if (a.vibes) fullContent += `- Vibes: ${Array.isArray(a.vibes) ? a.vibes.join(', ') : a.vibes}\n`
    if (a.greenFlags) fullContent += `- Green Flags: ${Array.isArray(a.greenFlags) ? a.greenFlags.join(', ') : a.greenFlags}\n`
    if (a.redFlags) fullContent += `- Red Flags: ${Array.isArray(a.redFlags) ? a.redFlags.join(', ') : a.redFlags}\n`
    fullContent += '\n'
  }
} catch (e) {
  console.log("Could not parse archetypes.js", e);
}

fs.writeFileSync(path.join(outDir, 'llms-full.txt'), fullContent)
console.log("✅ Wrote llms.txt and llms-full.txt for MeowBTI")
