export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      basket: {
        Row: {
          id: string;
          is_selected: boolean;
          product_id: string | null;
          profile_id: string | null;
          quantity: number | null;
          selected_color: string;
          selected_size: Database['public']['Enums']['product_size'];
        };
        Insert: {
          id?: string;
          is_selected?: boolean;
          product_id?: string | null;
          profile_id?: string | null;
          quantity?: number | null;
          selected_color: string;
          selected_size: Database['public']['Enums']['product_size'];
        };
        Update: {
          id?: string;
          is_selected?: boolean;
          product_id?: string | null;
          profile_id?: string | null;
          quantity?: number | null;
          selected_color?: string;
          selected_size?: Database['public']['Enums']['product_size'];
        };
        Relationships: [
          {
            foreignKeyName: 'basket_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'basket_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile_info';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'basket_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      invoice_products: {
        Row: {
          basket_id: string;
          id: number;
          invoice_id: string | null;
          product_id: string | null;
          quantity: number | null;
          selected_color: string;
          selected_size: Database['public']['Enums']['product_size'];
        };
        Insert: {
          basket_id: string;
          id?: number;
          invoice_id?: string | null;
          product_id?: string | null;
          quantity?: number | null;
          selected_color: string;
          selected_size: Database['public']['Enums']['product_size'];
        };
        Update: {
          basket_id?: string;
          id?: number;
          invoice_id?: string | null;
          product_id?: string | null;
          quantity?: number | null;
          selected_color?: string;
          selected_size?: Database['public']['Enums']['product_size'];
        };
        Relationships: [
          {
            foreignKeyName: 'invoice_products_invoice_id_fkey';
            columns: ['invoice_id'];
            isOneToOne: false;
            referencedRelation: 'invoices';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_invoice_products_basket_id_fkey';
            columns: ['basket_id'];
            isOneToOne: false;
            referencedRelation: 'basket';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_invoice_products_basket_id_fkey';
            columns: ['basket_id'];
            isOneToOne: false;
            referencedRelation: 'basket_info';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'public_invoice_products_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      invoices: {
        Row: {
          created_at: string | null;
          customer_info: Database['public']['CompositeTypes']['invoice_customer'] | null;
          id: string;
          profile_id: string | null;
          shipment_method: Database['public']['Enums']['shipment_method'] | null;
          state: Database['public']['Enums']['invoice_state'];
          total_price: number | null;
        };
        Insert: {
          created_at?: string | null;
          customer_info?: Database['public']['CompositeTypes']['invoice_customer'] | null;
          id?: string;
          profile_id?: string | null;
          shipment_method?: Database['public']['Enums']['shipment_method'] | null;
          state?: Database['public']['Enums']['invoice_state'];
          total_price?: number | null;
        };
        Update: {
          created_at?: string | null;
          customer_info?: Database['public']['CompositeTypes']['invoice_customer'] | null;
          id?: string;
          profile_id?: string | null;
          shipment_method?: Database['public']['Enums']['shipment_method'] | null;
          state?: Database['public']['Enums']['invoice_state'];
          total_price?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'invoices_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile_info';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'invoices_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          available_colors: string[] | null;
          available_sizes: Database['public']['Enums']['product_size'][] | null;
          categories: string[] | null;
          created_at: string | null;
          description: string | null;
          id: string;
          image_url: string;
          name: string;
          price: number;
          sale_state: Database['public']['Enums']['sale_state'];
          sold: number | null;
          tags: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          available_colors?: string[] | null;
          available_sizes?: Database['public']['Enums']['product_size'][] | null;
          categories?: string[] | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url: string;
          name: string;
          price: number;
          sale_state?: Database['public']['Enums']['sale_state'];
          sold?: number | null;
          tags?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          available_colors?: string[] | null;
          available_sizes?: Database['public']['Enums']['product_size'][] | null;
          categories?: string[] | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string;
          name?: string;
          price?: number;
          sale_state?: Database['public']['Enums']['sale_state'];
          sold?: number | null;
          tags?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profile_address: {
        Row: {
          extra_address: string | null;
          id: number;
          is_main: boolean | null;
          main_address: string | null;
          profile_id: string | null;
        };
        Insert: {
          extra_address?: string | null;
          id?: number;
          is_main?: boolean | null;
          main_address?: string | null;
          profile_id?: string | null;
        };
        Update: {
          extra_address?: string | null;
          id?: number;
          is_main?: boolean | null;
          main_address?: string | null;
          profile_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_address_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile_info';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_address_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          birthdate: string | null;
          email: string | null;
          id: string;
          name: string | null;
          phone: string | null;
          stripe_customer: string | null;
        };
        Insert: {
          birthdate?: string | null;
          email?: string | null;
          id: string;
          name?: string | null;
          phone?: string | null;
          stripe_customer?: string | null;
        };
        Update: {
          birthdate?: string | null;
          email?: string | null;
          id?: string;
          name?: string | null;
          phone?: string | null;
          stripe_customer?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      basket_info: {
        Row: {
          id: string | null;
          image_url: string | null;
          is_selected: boolean | null;
          name: string | null;
          price: number | null;
          product_id: string | null;
          profile_id: string | null;
          quantity: number | null;
          selected_color: string | null;
          selected_size: Database['public']['Enums']['product_size'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'basket_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'basket_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'basket_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: false;
            referencedRelation: 'profile_info';
            referencedColumns: ['id'];
          },
        ];
      };
      profile_info: {
        Row: {
          birthdate: string | null;
          email: string | null;
          extra_address: string | null;
          id: string | null;
          main_address: string | null;
          name: string | null;
          phone: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      add_subscriber: {
        Args: {
          writer_name: string;
          subscriber_name: string;
          plan: 'Gold' | 'Silver' | 'Bronze';
        };
        Returns: undefined;
      };
      example_condition: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      invoice_state: '결제대기' | '결제완료' | '배송중' | '배송완료' | '환불완료';
      product_size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
      sale_state: '판매중' | '대기중';
      shipment_method: '택배배송' | '퀵서비스' | '직접수령';
    };
    CompositeTypes: {
      inventory_item: {
        name: string;
        supplier_id: number;
        price: number;
      };
      invoice_customer: {
        name: string;
        phone: string;
        main_address: string;
        extra_address: string;
      };
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never;
