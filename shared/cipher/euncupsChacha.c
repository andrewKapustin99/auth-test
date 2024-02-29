#include <node_api.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <wolfssl/wolfcrypt/chacha.h>
#include <wolfssl/wolfcrypt/dh.h>
#include <wolfssl/wolfcrypt/random.h>
#include <wolfssl/wolfcrypt/chacha20_poly1305.h>

napi_value DecryptMessage(napi_env env, napi_callback_info info)
{
    napi_status status;

    // Проверяем количество аргументов
    size_t argc = 2;
    napi_value argv[2];
    status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
    if (status != napi_ok || argc < 2)
    {
        napi_throw_error(env, NULL, "Ожидались два аргумента: строка и sharedSecretBuffer.");
        return NULL;
    }

    // Получаем строку из первого аргумента
    size_t inputStringLength;
    char *inputStringData;
    status = napi_get_value_string_utf8(env, argv[0], NULL, 0, &inputStringLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при получении длины строки.");
        return NULL;
    }

    inputStringData = (char *)malloc(inputStringLength + 1);
    if (inputStringData == NULL)
    {
        napi_throw_error(env, NULL, "Ошибка при выделении памяти для строки.");
        return NULL;
    }

    status = napi_get_value_string_utf8(env, argv[0], inputStringData, inputStringLength + 1, NULL);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при получении данных строки.");
        free(inputStringData);
        return NULL;
    }

    // Получаем sharedSecretBuffer из второго аргумента
    size_t sharedSecretLength;
    unsigned char *sharedSecretData;
    status = napi_get_buffer_info(env, argv[1], (void **)&sharedSecretData, &sharedSecretLength);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при получении данных из sharedSecretBuffer.");
        free(inputStringData);
        return NULL;
    }
    unsigned char *shared_secret = calloc(32, 1);
    for (size_t i = 0; i < 32; i++)
    {
        shared_secret[i] = sharedSecretData[i];
    }

    // Создаем буферы и массивы для хранения cipher, block и authTag
    size_t cipherLength = strlen(inputStringData);
    size_t blockLength = 12;
    size_t authTagLength = 16;

    byte *block = calloc(blockLength, 1);
    byte *inAAD = ""; // additional authenticated data
    byte *cipher = (byte *)calloc(cipherLength, 1);
    byte *authTag = calloc(authTagLength, 1);

    if (block == NULL || cipher == NULL || authTag == NULL)
    {
        napi_throw_error(env, NULL, "Ошибка при выделении памяти для данных.");
        free(inputStringData);
        return NULL;
    }

    // Генерируем IV в block
    RNG rng;
    int ret = wc_InitRng(&rng);
    if (ret != 0)
    {
        napi_throw_error(env, NULL, "Ошибка при инициализации RNG.");
        free(inputStringData);
        free(block);
        free(cipher);
        free(authTag);
        return NULL;
    }

    ret = wc_RNG_GenerateBlock(&rng, block, blockLength);
    if (ret != 0)
    {
        napi_throw_error(env, NULL, "Ошибка при генерации IV.");
        free(inputStringData);
        free(block);
        free(cipher);
        free(authTag);
        return NULL;
    }

    // Выполняем шифрование
    ret = wc_ChaCha20Poly1305_Encrypt(shared_secret, block, inAAD, 0, inputStringData, cipherLength, cipher, authTag);
    if (ret != 0)
    {
        napi_throw_error(env, NULL, "Ошибка при шифровании.");
        free(inputStringData);
        free(block);
        free(cipher);
        free(authTag);
        return NULL;
    }
    printf("cipherLength в encipt: %zu\n", cipherLength);
    printf("shared_secret в encipt: %s\n", shared_secret);
    printf("block in encipt: %s\n", block);
    printf("authTag in encipt: %s\n", authTag);
    printf("cipher in encipt: %s\n", cipher);


    // char *mess = (char *)calloc(cipherLength + 1, 1);
    // int ch1 = wc_ChaCha20Poly1305_Decrypt(shared_secret, block, inAAD, 0, cipher, cipherLength, authTag, mess);
    // if (ch1 != 0)
    // {
    //     napi_throw_error(env, NULL, "Ошибка при расшифровании.");
    //     free(mess);
    //     return NULL;
    // }
    // printf("message: %s", mess);

    // Создаем объект JavaScript для хранения данных
    napi_value resultObject;
    status = napi_create_object(env, &resultObject);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании объекта для результата.");
        free(inputStringData);
        free(block);
        free(cipher);
        free(authTag);
        return NULL;
    }

    // Создаем буферы Node.js для значений cipher, block и authTag
    napi_value cipherBuffer, blockBuffer, authTagBuffer;
    status = napi_create_buffer_copy(env, cipherLength, cipher, NULL, &cipherBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании буфера для cipher.");
        free(inputStringData);
        free(block);
        free(cipher);
        free(authTag);
        return NULL;
    }

    status = napi_create_buffer_copy(env, blockLength, block, NULL, &blockBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании буфера для block.");
        free(inputStringData);
        free(block);
        free(cipher);
        free(authTag);
        return NULL;
    }

    status = napi_create_buffer_copy(env, authTagLength, authTag, NULL, &authTagBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании буфера для authTag.");
        free(inputStringData);
        free(block);
        free(cipher);
        free(authTag);
        return NULL;
    }

    // Устанавливаем свойства объекта для хранения буферов
    status = napi_set_named_property(env, resultObject, "cipher", cipherBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при установке свойства 'cipher'.");
        free(inputStringData);
        free(block);
        free(cipher);
        free(authTag);
        return NULL;
    }

    status = napi_set_named_property(env, resultObject, "block", blockBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при установке свойства 'block'.");
        free(inputStringData);
        free(block);
        free(cipher);
        free(authTag);
        return NULL;
    }

    status = napi_set_named_property(env, resultObject, "authTag", authTagBuffer);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при установке свойства 'authTag'.");
        free(inputStringData);
        free(block);
        free(cipher);
        free(authTag);
        return NULL;
    }

    // size_t length = strlen(sharedSecretData);
    // printf("Длина shared_secret в EncupsChacha: %zu\n", length);

    // printf("cipher in Encript %s\n", cipher);
    // printf("block in Encript %s\n", block);
    // printf("authTag in Encript %s\n", authTag);

    // printf("cipherBuffer in Encript %s\n", cipherBuffer);
    // printf("blockBuffer in Encript %s\n", blockBuffer);
    // printf("authTagBuffer in Encript %s\n", authTagBuffer);

    // Освобождаем выделенную память
    free(inputStringData);
    free(block);
    free(cipher);
    free(authTag);

    return resultObject;
}

napi_value Init(napi_env env, napi_value exports)
{
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, NULL, 0, DecryptMessage, NULL, &fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при создании функции");
        return NULL;
    }

    status = napi_set_named_property(env, exports, "DecryptMessage", fn);
    if (status != napi_ok)
    {
        napi_throw_error(env, NULL, "Ошибка при установке функции");
        return NULL;
    }

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
