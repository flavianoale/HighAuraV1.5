# ASCENSÃO OS PRO (PWA Offline)

Versão expandida e mais interativa, inspirada no app de referência (agora com interface de dopamina máxima):

- HUD com missão por janela de horário, pressão inteligente, streak, rank e integridade.
- 14 abas operacionais: HUD, Protocolo, Dieta, Treino, Estudo, Bíblia, Tarefas, Social, Público, Projetos, Finanças, Diário, Relatórios e Config.
- Timer de estudo, sistema de dieta com porções e travas, treino com registro de sets e progressão simples.
- Treino programado completo (Casa e Academia) com runner de sessão e timers segundo a segundo para execução e descanso.
- Mentor por áudio (TTS + bipes): início execução, início descanso, aviso de 10s restantes e fim de fase.
- AI Training Engine: scores proprietários (Stimulus Efficiency, Fatigue Index, Recovery Readiness, Hypertrophy Potential, Neural Drive), digital muscle map, deload adaptativo e Performance Global Score.
- Tarefas com horário (criar/concluir/apagar) integradas no dia.
- Config avançada (objetivo, macros automáticas, janelas do dia, strict mode, CRT, som, música e volume).
- Música offline via IndexedDB (upload, play, stop e apagar).
- Backup/restore JSON + reset total.
- Aba Público: checklist de lançamento, simulação de preço e metas de conversão para preparar publicação/venda.
- Hardening básico de segurança (sanitização de campos textuais e redução de uso de HTML dinâmico no HUD).

## Rodar
```bash
python -m http.server 4173
```
Acesse `http://localhost:4173`.


## Atualização
- Se o navegador mostrar versão antiga (cache), use em Config: **FORÇAR ATUALIZAÇÃO APP**.

- Microinterações de dopamina: combo XP, pulsos visuais, vibração e popups de recompensa em tempo real.
