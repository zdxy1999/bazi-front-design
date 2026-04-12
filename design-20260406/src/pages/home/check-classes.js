// 在home页面的Console中运行这个脚本

console.log('\n========== 检查卡片类名和样式 ==========\n');

const cards = document.querySelectorAll('.glass-card');
console.log(`找到 ${cards.length} 张卡片`);

cards.forEach((card, index) => {
  console.log(`\n卡片 ${index + 1}:`);
  console.log('  类名:', card.className);
  
  const inlineStyle = card.getAttribute('style');
  console.log('  inline style:', inlineStyle);
  
  // 检查是否有五行类
  const hasWoodClass = card.classList.contains('wood-card');
  const hasFireClass = card.classList.contains('fire-card');
  const hasEarthClass = card.classList.contains('earth-card');
  const hasMetalClass = card.classList.contains('metal-card');
  const hasWaterClass = card.classList.contains('water-card');
  
  console.log('  五行类:');
  console.log('    wood-card:', hasWoodClass);
  console.log('    fire-card:', hasFireClass);
  console.log('    earth-card:', hasEarthClass);
  console.log('    metal-card:', hasMetalClass);
  console.log('    water-card:', hasWaterClass);
  
  // 检查计算后的背景色
  const computed = window.getComputedStyle(card);
  console.log('  计算后的背景色:', computed.background);
  
  // 检查.card-edge-glow
  const edgeGlow = card.querySelector('.card-edge-glow');
  if (edgeGlow) {
    console.log('  .card-edge-glow存在');
    const edgeStyle = window.getComputedStyle(edgeGlow);
    console.log('  .card-edge-glow opacity:', edgeStyle.opacity);
    console.log('  .card-edge-glow display:', edgeStyle.display);
  } else {
    console.log('  .card-edge-glow不存在');
  }
});

console.log('\n========== 检查结束 ==========\n');
