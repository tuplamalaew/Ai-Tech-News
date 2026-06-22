const url = process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/1518447189297205298/UO3JafOsoHKY9zCygZkao2_WYZ7GyIKejFnnPGtg6tde0z_DTl2bkJJQrLjo62EAqcm_';

const payload = {
  content: 'Testing thread creation',
  thread_name: '📰 สรุปข่าวไอทีประจำวันที่ 22 มิ.ย.'
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
.then(async (res) => {
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response:', text);
})
.catch(console.error);
