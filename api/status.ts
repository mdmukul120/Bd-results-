export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    online: true,
    server: 'Vercel Serverless',
    timestamp: new Date().toISOString(),
  });
}
