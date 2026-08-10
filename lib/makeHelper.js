/**

   * WhatsApp bot Cailin Assistant using baileys (@wishkeysocket/baileys)
   * Type plugins  | Modules ESM
   * Creator Mommy kyu
   * Follow https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D
   * Follow https://whatsapp.com/channel/0029VbCsmdMC1Fu6NbIaaY2T
   
   ** Dilarang menjual   script ini.*
 *
 * Credits: Nixel
 * Contributors: ~ Ahmad tumbuh kembang
 * Channel: https://whatsapp.com/channel/0029VbCV1ck8fewpdNb2TY2k
 *
 * [ID 🇮🇩] - Jangan hapus creator, credit & contributor hargain!!
 * [ENG 🇬🇧] - Don't delete creator, credit & contributor, appreciate it!!
 *
 * Example code helper? check README.md
 *
   
   ** [ID] - Baca file README.md untuk melihat panduan!
   ** [ENG] -  Read the README.md file to see the guide!
   
   ** Copyright (©) Mommy kyu 2026 **
   
**/

import {
  generateWAMessageFromContent,
  generateWAMessage,
  prepareWAMessageMedia,
  proto
} from '@whiskeysockets/baileys';
import crypto from 'crypto';


const CailinInteractiveNode = {
  tag: 'biz',
  attrs: {},
  content: [{
    tag: 'interactive',
    attrs: { type: 'native_flow', v: '1' },
    content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
  }]
};

/**
 * Cailin Assistant Baileys Helper Extensions
 * Optimized for high performance and sleek structure
 */
export default function makeHelper(socketInstance) {
  if (!socketInstance) return socketInstance;

  socketInstance.conn = socketInstance;
  socketInstance.sock = socketInstance;

  socketInstance.sendLinkPreview = (targetJid, contentPayload = {}, options = {}) => {
    const text = typeof contentPayload === 'string' ? contentPayload : (contentPayload.text || '');
    return socketInstance.sendMessage(targetJid, { text, ...(typeof contentPayload === 'object' ? contentPayload : {}) }, options);
  };

  
  const createBaileysMessage = (targetJid, contentPayload, options = {}) =>
    generateWAMessageFromContent(targetJid, contentPayload, {
      userJid: socketInstance.user?.id,
      quoted: options.quoted
    });

  const uploadMediaAttachment = async (mediaSource) =>
    prepareWAMessageMedia(mediaSource, { upload: socketInstance.waUploadToServer });

  const constructMediaHeader = async (mediaConfig = {}) => {
    if (mediaConfig.image) {
      const media = await uploadMediaAttachment({ image: mediaConfig.image });
      return { hasMediaAttachment: true, imageMessage: media.imageMessage };
    }
    if (mediaConfig.video) {
      const media = await uploadMediaAttachment({ video: mediaConfig.video });
      return { hasMediaAttachment: true, videoMessage: media.videoMessage };
    }
    if (mediaConfig.document) {
      const media = await uploadMediaAttachment({
        document: mediaConfig.document,
        mimetype: mediaConfig.mimetype || 'application/octet-stream',
        fileName: mediaConfig.filename || 'document'
      });
      return { hasMediaAttachment: true, documentMessage: media.documentMessage };
    }
    if (mediaConfig.location) {
      return {
        hasMediaAttachment: true,
        locationMessage: {
          degreesLatitude: mediaConfig.location.lat || 0,
          degreesLongitude: mediaConfig.location.lng || 0,
          name: mediaConfig.location.name || '',
          address: mediaConfig.location.address || '',
          jpegThumbnail: mediaConfig.location.jpegThumbnail || Buffer.from([])
        }
      };
    }
    if (mediaConfig.catalog) {
      const catalogInfo = mediaConfig.catalog;
      let productImage;
      if (catalogInfo.image) {
        const media = await uploadMediaAttachment({ image: catalogInfo.image });
        productImage = media.imageMessage;
      }
      return {
        hasMediaAttachment: true,
        productMessage: {
          product: {
            productImage,
            productId: catalogInfo.productId || '',
            title: catalogInfo.title || '',
            currencyCode: catalogInfo.currency || 'IDR',
            priceAmount1000: (catalogInfo.price || 0) * 1000,
            retailerId: catalogInfo.retailerId || '',
            url: catalogInfo.url || 'https://api.kyzzz.eu.cc',
            productImageCount: 1
          },
          businessOwnerJid: catalogInfo.businessJid || socketInstance.user?.id || ''
        }
      };
    }
    return { hasMediaAttachment: false };
  };

  
  const parseNativeButtons = (buttonList = []) => buttonList.map((buttonItem, index) => {
    if (buttonItem.name) return buttonItem;

    const labelText = buttonItem.displayText || buttonItem.text || '';

    if (buttonItem.url) return {
      name: 'cta_url', 
      buttonParamsJson: JSON.stringify({ 
         display_text: labelText, 
         url: buttonItem.url 
      }) 
    };
    
    if (buttonItem.copy || buttonItem.copyCode) return { 
      name: 'cta_copy', 
      buttonParamsJson: JSON.stringify({ 
         display_text: labelText, 
         copy_code: buttonItem.copy || buttonItem.copyCode 
      }) 
    };
    
    if (buttonItem.call || buttonItem.phone) return {
      name: 'cta_call', 
      buttonParamsJson: JSON.stringify({ 
         display_text: labelText, 
         phone_number: buttonItem.call || buttonItem.phone 
      }) 
    };
    
    if (buttonItem.type === 'reminder' || buttonItem.reminder) return { 
      name: 'cta_reminder', 
      buttonParamsJson: JSON.stringify({ 
        display_text: labelText 
      }) 
    };
    
    if (buttonItem.type === 'send_location' || buttonItem.type === 'location') return { 
      name: 'send_location', 
      buttonParamsJson: JSON.stringify({}) 
    };
     
    if (buttonItem.type === 'address') return { 
      name: 'address_message', 
      buttonParamsJson: JSON.stringify({ 
        display_text: labelText 
      }) 
    };
    
    if (buttonItem.transaction_id || buttonItem.type === 'payment_transaction') return { 
      name: 'wa_payment_transaction_details', 
      buttonParamsJson: JSON.stringify({ 
         transaction_id: buttonItem.transaction_id || '' 
      }) 
    };

    if (buttonItem.sections || buttonItem.rows) {
      const sections = buttonItem.sections
        ? buttonItem.sections.map(section => ({
            title: section.title || '',
            highlight_label: section.highlight_label || undefined,
            rows: (section.rows || []).map((row, rIndex) => ({
              header: row.header || undefined,
              title: row.title || row.text || '',
              description: row.description || row.desc || '',
              id: row.id || row.rowId || `row_${rIndex}`
            }))
          }))
        : [{
            title: buttonItem.sectionTitle || '',
            rows: (buttonItem.rows || []).map((row, rIndex) => ({
              header: row.header || undefined,
              title: row.title || row.text || '',
              description: row.description || row.desc || '',
              id: row.id || row.rowId || `row_${rIndex}`
            }))
          }];
      return {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({ title: buttonItem.title || buttonItem.buttonText || 'Pilih', sections, icon: buttonItem.icon || 'DEFAULT' })
      };
    }

    return { 
      name: 'quick_reply', 
      buttonParamsJson: JSON.stringify({ 
        display_text: labelText, 
        id: buttonItem.id || `btn_${index}` 
      }) 
    };
  });

  const getGlobalNewsletterContext = (customContext = {}) => {
    if (customContext === null) return null;
    return {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: global.newsletterJid || '120363407145383686@newsletter',
        newsletterName: global.newsletterName || 'Cailin Assistant',
        serverMessageId: 143
      },
      ...customContext
    };
  };

  const prepareContextInfo = (options = {}, extraContext = {}) => {
    const defaultContext = getGlobalNewsletterContext(extraContext);
    const contextObj = {
      ...(defaultContext || {}),
      ...(extraContext || {}),
      ...(options.contextInfo || {})
    };
    if (options.quoted) {
      const q = options.quoted;
      contextObj.stanzaId = q?.key?.id;
      contextObj.participant = q?.key?.participant || (q?.key?.fromMe ? socketInstance.user?.id : q?.sender) || q?.key?.remoteJid;
      contextObj.quotedMessage = q?.message;
    }
    if (options.forward || options.forwarded) {
      contextObj.forwardingScore = options.forwardingScore || 1;
      contextObj.isForwarded = true;
    }
    return contextObj;
  };

  const rawSendMessage = socketInstance.sendMessage.bind(socketInstance);
  const rawRelayMessage = socketInstance.relayMessage.bind(socketInstance);

  
  socketInstance.relayMessage = async (targetJid, rawMessage, options = {}) => {
    if (rawMessage && typeof rawMessage === 'object' && rawMessage.type) {
      return socketInstance.sendMessage(targetJid, rawMessage, options);
    }

    if (rawMessage?.imageMessage?.url && !rawMessage?.imageMessage?.directPath) {
      try {
        const media = await uploadMediaAttachment({ image: rawMessage.imageMessage.url });
        rawMessage.imageMessage = media.imageMessage;
      } catch (_) {}
    }
    const extraNodes = options.additionalNodes || [];
    const requiresBizNode = rawMessage?.interactiveMessage || rawMessage?.buttonsMessage ||
                             rawMessage?.viewOnceMessage?.message?.interactiveMessage;
    const hasBiz = extraNodes.some(n => n.tag === 'biz');
    const finalNodes = (requiresBizNode && !hasBiz) ? [CailinInteractiveNode, ...extraNodes] : extraNodes;
    return rawRelayMessage(targetJid, rawMessage, {
      ...options,
      additionalNodes: finalNodes.length ? finalNodes : undefined
    });
  };

  
  socketInstance.sendMessage = async (targetJid, contentPayload = {}, options = {}) => {
    if (contentPayload.buttons && Array.isArray(contentPayload.buttons)) return socketInstance.sendButtons(targetJid, contentPayload, options);
    if (contentPayload.type === 'bottom_sheet') return socketInstance.sendButtons(targetJid, contentPayload, options);
    if (contentPayload.type === 'carousel' || contentPayload.carousel) return socketInstance.sendButtons(targetJid, contentPayload, options);
    if (contentPayload.type === 'template') return socketInstance.sendButtons(targetJid, contentPayload, options);
    if (contentPayload.type === 'location_buttons') return socketInstance.sendButtons(targetJid, contentPayload, options);

    if (contentPayload.type === 'album' || contentPayload.album) {
      return socketInstance.sendAlbum(targetJid, contentPayload.medias || contentPayload.album || [], options);
    }

    if (contentPayload.type === 'product') return socketInstance.sendProduct(targetJid, contentPayload, options);
    if (contentPayload.type === 'order') return socketInstance.sendOrder(targetJid, contentPayload, options);
    if (contentPayload.type === 'poll') return socketInstance.sendPoll(targetJid, contentPayload, options);
    if (contentPayload.type === 'raw') return socketInstance.sendRawMessage(targetJid, contentPayload.message, options);

    if (contentPayload && typeof contentPayload === 'object' && !contentPayload.message) {
      if (options.noLinkPreview !== true && contentPayload.contextInfo !== null) {
        contentPayload.contextInfo = prepareContextInfo(options, contentPayload.contextInfo || {});
      }
    }

    return rawSendMessage(targetJid, contentPayload, options);
  };

  
  socketInstance.sendButtons = async (targetJid, contentPayload = {}, options = {}) => {
    const contextInfo = prepareContextInfo(options, contentPayload.contextInfo || {});

    if (contentPayload.buttonsMessage || contentPayload.templateMessage || contentPayload.listMessage || contentPayload.productMessage || contentPayload.carouselMessage || contentPayload.interactiveMessage) {
      return rawSendMessage(targetJid, contentPayload, options);
    }

    const header = await constructMediaHeader(contentPayload);
    const buttons = parseNativeButtons(contentPayload.buttons || []);
    const messageParamsJson = contentPayload.messageParams ? JSON.stringify(contentPayload.messageParams) : '';
    const messageObj = createBaileysMessage(targetJid, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            header: {
              title: contentPayload.title || '',
              subtitle: contentPayload.subtitle || '',
              hasMediaAttachment: header.hasMediaAttachment || false,
              ...(header.imageMessage && { imageMessage: header.imageMessage }),
              ...(header.videoMessage && { videoMessage: header.videoMessage }),
              ...(header.documentMessage && { documentMessage: header.documentMessage }),
              ...(header.locationMessage && { locationMessage: header.locationMessage })
            },
            body: { text: contentPayload.text || '' },
            footer: { text: contentPayload.footer || '© Cailin Assistant' },
            contextInfo,
            nativeFlowMessage: { buttons, messageParamsJson }
          })
        }
      }
    }, options);

    return socketInstance.relayMessage(targetJid, messageObj.message, {
      messageId: messageObj.key.id,
      additionalNodes: [CailinInteractiveNode, ...(options.additionalNodes || [])]
    });
  };

  
  socketInstance.sendList = async (targetJid, contentPayload = {}, options = {}) => {
    const contextInfo = prepareContextInfo(options, contentPayload.contextInfo || {});
    return socketInstance.sendMessage(targetJid, {
      listMessage: {
        title: contentPayload.title || '',
        description: contentPayload.text || '',
        buttonText: contentPayload.buttonText || 'Pilih',
        footerText: contentPayload.footer || '© Cailin Assistant',
        listType: contentPayload.listType || 1,
        sections: contentPayload.sections || [],
        contextInfo
      }
    }, options);
  };

  
  socketInstance.sendAlbum = async (targetJid, medias = [], options = {}) => {
    const album = await generateWAMessage(targetJid, { text: options.text || '' }, {
      userJid: socketInstance.user?.id,
      quoted: options.quoted
    });
    await socketInstance.relayMessage(targetJid, album.message, { messageId: album.key.id });
    for (const media of medias) {
      const content = media.image ? { image: media.image, caption: media.caption || '' }
                    : media.video ? { video: media.video, caption: media.caption || '' }
                    : null;
      if (!content) continue;
      const m = await generateWAMessage(targetJid, content, {
        userJid: socketInstance.user?.id,
        upload: socketInstance.waUploadToServer
      });
      m.message.messageContextInfo = {
        messageAssociation: {
          associationType: 1,
          parentMessageKey: album.key
        }
      };
      await socketInstance.relayMessage(targetJid, m.message, { messageId: m.key.id });
    }
    return album;
  };

  return socketInstance;
}
