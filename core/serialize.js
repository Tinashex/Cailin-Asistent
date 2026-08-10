/**

   * WhatsApp bot Cailin Assistant using baileys (@wishkeysocket/baileys)
   * Type plugins  | Modules ESM
   * Creator Mommy kyu
   * Follow https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D
   * Follow https://whatsapp.com/channel/0029VbCsmdMC1Fu6NbIaaY2T
   
   ** Dilarang menjual   script ini.*
   
   ** [ID] - Baca file README.md untuk melihat panduan!
   ** [ENG] -  Read the README.md file to see the guide!
   
   ** Copyright (©) Mommy kyu 2026 **
   
**/

import * as Baileys from '@whiskeysockets/baileys';

const lidCache = new Map();

export async function resolveJid(kyu, jid, msg = null) {
  if (!jid || typeof jid !== 'string') return jid;
  const normalized = Baileys.jidNormalizedUser(jid);

  if (!normalized.endsWith('@lid')) return normalized;

  
  if (lidCache.has(normalized)) {
    return lidCache.get(normalized);
  }

  
  const botLid = kyu?.user?.lid ? Baileys.jidNormalizedUser(kyu.user.lid) : null;
  if (botLid && botLid === normalized) {
    const botJid = Baileys.jidNormalizedUser(kyu.user?.id || kyu.user?.jid || '');
    if (botJid && botJid.endsWith('@s.whatsapp.net')) {
      lidCache.set(normalized, botJid);
      return botJid;
    }
  }

  
  if (msg) {
    const pn = msg.key?.participantPn || msg.participantPn || msg.key?.remoteJidPn || msg.contextInfo?.participantPn;
    if (pn) {
      const formatted = pn.includes('@s.whatsapp.net') ? pn : `${pn.replace(/\D/g, '')}@s.whatsapp.net`;
      lidCache.set(normalized, formatted);
      return formatted;
    }
  }

  
  try {
    if (kyu?.signalRepository?.lidToJidMap) {
      const mapped = kyu.signalRepository.lidToJidMap.get(normalized);
      if (mapped && mapped.endsWith('@s.whatsapp.net')) {
        lidCache.set(normalized, mapped);
        return mapped;
      }
    }
  } catch (_) {}

  return normalized;
}

export async function SerializeMessage(kyu, msg) {
  if (!msg || !msg.message) return null;

  const m = Baileys.extractMessageContent(msg.message);
  const ctx = {};

  const rawChatId = msg.key.remoteJid || '';
  ctx.id = rawChatId.endsWith('@lid') ? await resolveJid(kyu, rawChatId, msg) : Baileys.jidNormalizedUser(rawChatId);
  ctx.group = ctx.id.endsWith('@g.us');

  const rawSender = ctx.group
    ? (msg.key.participant || msg.participant || '')
    : rawChatId;

  ctx.sender = await resolveJid(kyu, rawSender, msg);

  ctx.pushname = msg.pushName || null;
  ctx.fromMe = msg.key.fromMe;
  ctx.msgType = Baileys.getContentType(m || msg.message);
  ctx.timestamp = msg.messageTimestamp ? parseInt(msg.messageTimestamp) * 1000 : Date.now();

  const keyId = msg.key?.id || '';
  ctx.device = keyId.startsWith('3EB0') ? 'Web' : keyId.startsWith('BAE5') ? 'Android' : 'Unknown';
  ctx.isBaileys = keyId.length === 16 || keyId.length === 22;

  ctx.text = m?.conversation ||
    m?.extendedTextMessage?.text ||
    m?.imageMessage?.caption ||
    m?.videoMessage?.caption ||
    m?.documentMessage?.caption ||
    m?.buttonsResponseMessage?.selectedDisplayText ||
    m?.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m?.templateButtonReplyMessage?.selectedDisplayText ||
    '';

  if (ctx.msgType === 'interactiveResponseMessage' && m?.interactiveResponseMessage?.nativeFlowResponseMessage) {
    try {
      const parsed = JSON.parse(m.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson);
      ctx.text = parsed?.id || parsed?.response || '';
    } catch { ctx.text = ''; }
  }

  const contextInfo = m?.extendedTextMessage?.contextInfo ||
    m?.imageMessage?.contextInfo ||
    m?.videoMessage?.contextInfo ||
    m?.documentMessage?.contextInfo || null;

  const rawMentions = contextInfo?.mentionedJid || [];
  ctx.mentionedJid = await Promise.all(
    rawMentions.map(jid => resolveJid(kyu, jid, msg))
  );

  ctx.quoted = null;
  if (contextInfo?.quotedMessage) {
    const quotedSenderRaw = contextInfo.participant || '';
    const quotedSender = await resolveJid(kyu, quotedSenderRaw, msg);

    ctx.quoted = {
      message: contextInfo.quotedMessage,
      sender: quotedSender,
      text: contextInfo.quotedMessage?.conversation ||
        contextInfo.quotedMessage?.extendedTextMessage?.text ||
        contextInfo.quotedMessage?.imageMessage?.caption ||
        contextInfo.quotedMessage?.videoMessage?.caption || '',
      msgType: Baileys.getContentType(contextInfo.quotedMessage),
      key: {
        remoteJid: ctx.id,
        fromMe: false,
        id: contextInfo.stanzaId,
        participant: quotedSender,
      },
    };
    const qMedia = contextInfo.quotedMessage?.[ctx.quoted.msgType];
    if (qMedia?.mimetype) {
      ctx.quoted.mimetype = qMedia.mimetype;
      ctx.quoted.isMedia = /image|video|sticker|audio|document/.test(qMedia.mimetype);
      ctx.quoted.mediaType = ctx.quoted.msgType?.replace('Message', '').toLowerCase() || null;
      ctx.quoted.media = qMedia;
    }
  }

  const mediaContent = m?.[ctx.msgType];
  ctx.mimetype = mediaContent?.mimetype || null;
  ctx.isMedia = /image|video|sticker|audio|document/.test(ctx.mimetype || '');
  ctx.mediaType = ctx.isMedia ? ctx.msgType?.replace('Message', '').toLowerCase() : null;
  ctx.fileName = mediaContent?.fileName || null;
  ctx.fileSize = mediaContent?.fileLength || null;
  ctx.isViewOnce = mediaContent?.viewOnce || false;
  ctx.media = ctx.isMedia ? mediaContent : null;

  const text = ctx.text.trim();
  const prefixes = ['!', '.', '#', '/', '-', '$', '%', '^', '&', '*', '+', '='];
  
  if (text.startsWith('=>')) {
    ctx.prefix = '=>';
    ctx.cmd = '=>';
    ctx.query = text.slice(2).trim();
    ctx.args = ctx.query ? [ctx.query] : [];
  } else if (text.startsWith('>')) {
    ctx.prefix = '>';
    ctx.cmd = '>';
    ctx.query = text.slice(1).trim();
    ctx.args = ctx.query ? [ctx.query] : [];
  } else if (text.startsWith('$')) {
    ctx.prefix = '$';
    ctx.cmd = '$';
    ctx.query = text.slice(1).trim();
    ctx.args = ctx.query ? [ctx.query] : [];
  } else {
    ctx.prefix = prefixes.find(p => text.startsWith(p)) || null;
    if (ctx.prefix) {
      const withoutPrefix = text.slice(ctx.prefix.length).trim();
      const parts = withoutPrefix.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)?.map(p => p.replace(/^["']|["']$/g, '')) || [];
      ctx.cmd = parts[0]?.toLowerCase() || null;
      ctx.args = parts.slice(1);
      ctx.query = ctx.args.join(' ');
    } else {
      ctx.cmd = null;
      ctx.args = [];
      ctx.query = '';
    }
  }

  ctx.reply = (text, options = {}) => {
    if (typeof text === 'string') {
      return kyu.sendMessage(ctx.id, { text, ...options }, { quoted: msg });
    }
    return kyu.sendMessage(ctx.id, { ...text, ...options }, { quoted: msg });
  };

  ctx.react = (emoji) =>
    kyu.sendMessage(ctx.id, { react: { text: emoji, key: msg.key } });

  ctx.delete = () =>
    kyu.sendMessage(ctx.id, { delete: msg.key });

  ctx.edit = (text, options = {}) =>
    kyu.sendMessage(ctx.id, { text, edit: msg.key, ...options });

  ctx.forward = (jid, options = {}) =>
    kyu.sendMessage(jid, { forward: msg, ...options });

  if (ctx.isMedia && mediaContent?.url) {
    ctx.download = async () => {
      const stream = await Baileys.downloadContentFromMessage(mediaContent, ctx.mediaType);
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      return Buffer.concat(chunks);
    };
  }

  ctx.getName = () => ctx.pushname || ctx.sender?.split('@')[0] || 'Unknown';

  if (msg) {
    msg.chat = ctx.id;
    msg.sender = ctx.sender;
    msg.pushname = ctx.pushname;
    msg.fromMe = ctx.fromMe;
    msg.text = ctx.text;
    msg.args = ctx.args;
    msg.query = ctx.query;
    msg.prefix = ctx.prefix;
    msg.cmd = ctx.cmd;
    msg.reply = ctx.reply;
    msg.react = ctx.react;
    msg.delete = ctx.delete;
    msg.edit = ctx.edit;
    msg.forward = ctx.forward;
    msg.quoted = ctx.quoted;
    msg.isGroup = ctx.group;
    msg.download = ctx.download;
    msg.getName = ctx.getName;
    msg.mimetype = ctx.mimetype;
    msg.isMedia = ctx.isMedia;
    msg.mediaType = ctx.mediaType;
    msg.media = ctx.media;
  }

  return ctx;
}
