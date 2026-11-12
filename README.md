# Câmera Universal 360

Central de monitoramento multi-marca para câmeras IP, com interface web responsiva e PWA instalável.

> **Estado atual:** versão inicial da interface (0.1.0). O cadastro é demonstrativo e fica no armazenamento local do navegador. Ainda não há conexão com câmeras, transmissão, gravação ou notificações reais.

## Executar localmente

Como esta primeira entrega é uma PWA estática, basta servir a pasta por HTTP:

```bash
python -m http.server 8080
```

Acesse `http://localhost:8080`. Para testar o service worker, use localhost ou HTTPS.

## Arquitetura alvo

- **Web/PWA:** interface responsiva para Android, tablet e desktop.
- **API/backend:** autenticação, autorização por usuário, cadastro de dispositivos e emissão de sessões temporárias.
- **Gateway local:** agente instalado na rede do cliente para descoberta ONVIF e acesso RTSP sem expor câmeras diretamente à internet.
- **Mídia:** MediaMTX ou serviço equivalente para receber RTSP e publicar WebRTC/HLS conforme dispositivo e navegador.
- **Armazenamento:** gravação contínua ou por evento em disco/NVR/objeto, com retenção configurável.
- **Eventos:** ONVIF Events e/ou análise de movimento no gateway; notificações push via backend.
- **PTZ:** comandos ONVIF Profile S/T compatíveis, com autorização explícita.

### Fluxo de vídeo

1. O gateway local descobre ou recebe a câmera ONVIF.
2. Credenciais são armazenadas no cofre do gateway, nunca no frontend.
3. O gateway obtém o stream RTSP e valida o dispositivo.
4. O servidor de mídia converte/encaminha para WebRTC ou HLS.
5. A aplicação recebe uma URL de sessão curta, autenticada e autorizada.

### Acesso remoto

Para acesso fora da rede local, usar conexão de saída do gateway para um relay/backend autenticado, WebRTC com STUN/TURN e tokens de curta duração. Não abrir portas RTSP/ONVIF no roteador e não expor câmeras diretamente à internet.

## Compatibilidade e limites

- **ONVIF:** descoberta, capacidades, eventos e PTZ dependem do perfil e implementação do fabricante/modelo.
- **RTSP:** permite receber streams de muitos equipamentos IP, mas navegadores não reproduzem RTSP diretamente; é necessário gateway/transcodificação.
- **Fabricantes com P2P/nuvem proprietária:** exigem API/SDK oficial e autorização. Não há compatibilidade universal automática.
- **Áudio, gravações e PTZ:** dependem de suporte no modelo, codec, firmware e permissões.

## Segurança obrigatória antes de produção

- HTTPS em todas as interfaces públicas.
- Credenciais de câmera criptografadas no gateway/cofre; nunca em localStorage, logs ou URLs.
- MFA opcional, controle de acesso por usuário e auditoria.
- Tokens curtos e revogáveis para streams e comandos PTZ.
- Proteção contra SSRF: validar IPs privados, ranges permitidos, DNS rebinding e destinos; bloquear acesso a endpoints de metadata.
- Limites de requisição, validação de entrada, atualização de dependências e política de retenção.
- Acesso somente a câmeras próprias ou com autorização expressa.

## Roadmap

1. [x] Estrutura inicial da PWA e painel responsivo.
2. [x] Formulário demonstrativo de cadastro local.
3. [ ] Backend de autenticação e API de dispositivos.
4. [ ] Gateway Linux/Docker com ONVIF discovery.
5. [ ] RTSP ingest e WebRTC playback.
6. [ ] Áudio e seleção de streams.
7. [ ] Gravação, calendário e reprodução.
8. [ ] Eventos de movimento e notificações.
9. [ ] PTZ ONVIF com controles e limites de segurança.
10. [ ] Testes com modelos reais e implantação.

## Estrutura

- `index.html` — aplicação e diálogos.
- `styles.css` — layout responsivo.
- `app.js` — interação da versão demonstrativa.
- `manifest.webmanifest` — instalação PWA.
- `sw.js` — cache offline da interface.
- `icons/camera.svg` — ícone da aplicação.
