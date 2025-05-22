
import { supabase } from "@/integrations/supabase/client";

export class MoralisService {
  private static instance: MoralisService;
  private apiKey: string | null = null;

  private constructor() {
    // Singleton pattern
  }

  public static getInstance(): MoralisService {
    if (!MoralisService.instance) {
      MoralisService.instance = new MoralisService();
    }
    return MoralisService.instance;
  }

  /**
   * Récupère la clé API Moralis depuis les secrets Supabase
   * @returns Promise<string> - La clé API Moralis
   */
  public async getApiKey(): Promise<string> {
    if (this.apiKey) {
      return this.apiKey;
    }

    try {
      const { data, error } = await supabase.functions.invoke("get-moralis-key", {});
      
      if (error) {
        throw error;
      }
      
      this.apiKey = data.apiKey;
      return this.apiKey;
    } catch (error) {
      console.error("Erreur lors de la récupération de la clé API Moralis:", error);
      throw error;
    }
  }
}

export const moralisService = MoralisService.getInstance();
